CLASS lcl_event_helper IMPLEMENTATION.
  METHOD event.
    IF t_arg IS INITIAL.
      result = event.
    ELSE.
      DATA(lv_args) = concat_lines_of( table = t_arg sep = ',' ).
      result = |{ event }({ lv_args })|.
    ENDIF.
  ENDMETHOD.
ENDCLASS.


CLASS lcl_action_mgr IMPLEMENTATION.
  METHOD add_action.
    DATA lr_data TYPE REF TO data.
    FIELD-SYMBOLS <fs_data> TYPE any.

    IF p IS SUPPLIED.
      CREATE DATA lr_data LIKE p.
      ASSIGN lr_data->* TO <fs_data>.
      IF sy-subrc = 0.
        <fs_data> = p.
      ENDIF.
    ENDIF.

    APPEND VALUE #( type    = n
                    payload = lr_data ) TO mt_actions.
  ENDMETHOD.

  METHOD get_actions.
    result = mt_actions.
  ENDMETHOD.

  METHOD toast_display.
    TYPES:
      BEGIN OF ty_s_toast,
        text     TYPE string,
        duration TYPE string,
      END OF ty_s_toast.
    DATA ls_toast TYPE ty_s_toast.

    ls_toast-text     = text.
    ls_toast-duration = duration.
    add_action( n = 'TOAST'
                p = ls_toast ).
  ENDMETHOD.

  METHOD set_title.
    add_action( n = 'TITLE'
                p = title ).
  ENDMETHOD.

  METHOD clipboard_write.
    add_action( n = 'CLIPBOARD_WRITE'
                p = text ).
  ENDMETHOD.

  METHOD open_new_tab.
    add_action( n = 'OPEN_NEW_TAB'
                p = url ).
  ENDMETHOD.

  METHOD file_download.
    TYPES:
      BEGIN OF ty_s_download,
        filename TYPE string,
        base64   TYPE string,
        type     TYPE string,
      END OF ty_s_download.
    DATA ls_download TYPE ty_s_download.

    ls_download-filename = filename.
    ls_download-base64   = base64.
    ls_download-type     = type.
    add_action( n = 'FILE_DOWNLOAD'
                p = ls_download ).
  ENDMETHOD.
ENDCLASS.


CLASS lcl_binding_resolver IMPLEMENTATION.
  METHOD constructor.
    mo_app = io_app.
  ENDMETHOD.

  METHOD bind.
    IF mt_nodes IS INITIAL.
      resolve( EXPORTING iv_path = ''
                         iv_data = mo_app
               CHANGING  ct_node = mt_nodes ).
    ENDIF.

    DATA(lr_val) = REF #( val ).
    READ TABLE mt_nodes ASSIGNING FIELD-SYMBOL(<ls_node>)
      WITH KEY dref = lr_val.
    IF sy-subrc = 0.
      result = |\{{ <ls_node>-path }\}|.
      RETURN.
    ENDIF.

    zcx_abaplit_error=>raise( 'Binding not found. Ensure variable is a public attribute of application.' ).
  ENDMETHOD.

  METHOD resolve.
    DATA(lo_desc) = cl_abap_typedescr=>describe_by_data( iv_data ).

    CASE lo_desc->kind.
      WHEN cl_abap_typedescr=>kind_struct.
        resolve_struct( EXPORTING iv_path = iv_path
                                  iv_data = iv_data
                                  io_desc = CAST #( lo_desc )
                        CHANGING  ct_node = ct_node ).
      WHEN cl_abap_typedescr=>kind_ref.
        CASE lo_desc->type_kind.
          WHEN cl_abap_typedescr=>typekind_dref.
            resolve_dref( EXPORTING iv_path = iv_path
                                    ir_data = iv_data
                          CHANGING  ct_node = ct_node ).
          WHEN cl_abap_typedescr=>typekind_oref.
            resolve_oref( EXPORTING iv_path = iv_path
                                    io_data = iv_data
                          CHANGING  ct_node = ct_node ).
        ENDCASE.
      WHEN OTHERS.
        IF iv_path IS NOT INITIAL.
          APPEND VALUE #( path = iv_path
                          dref = REF #( iv_data ) ) TO ct_node.
        ENDIF.
    ENDCASE.
  ENDMETHOD.

  METHOD resolve_struct.
    DATA lr_field TYPE REF TO data.
    FIELD-SYMBOLS <fs_field> TYPE any.

    LOOP AT io_desc->components ASSIGNING FIELD-SYMBOL(<ls_comp>).
      DATA(lv_field) = COND string( WHEN iv_path IS INITIAL THEN |{ <ls_comp>-name }|
                                    ELSE |{ iv_path }.{ <ls_comp>-name }| ).
      ASSIGN COMPONENT <ls_comp>-name OF STRUCTURE iv_data TO <fs_field>.
      IF sy-subrc = 0.
        lr_field = REF #( <fs_field> ).
        APPEND VALUE #( path = lv_field
                        dref = lr_field ) TO ct_node.
        resolve( EXPORTING iv_path = lv_field
                           iv_data = <fs_field>
                 CHANGING  ct_node = ct_node ).
      ENDIF.
    ENDLOOP.
  ENDMETHOD.

  METHOD resolve_dref.
    FIELD-SYMBOLS <fs_deref> TYPE any.

    IF ir_data IS BOUND.
      ASSIGN ir_data->* TO <fs_deref>.
      IF sy-subrc = 0.
        resolve( EXPORTING iv_path = iv_path
                           iv_data = <fs_deref>
                 CHANGING  ct_node = ct_node ).
      ENDIF.
    ENDIF.
  ENDMETHOD.

  METHOD resolve_oref.
    FIELD-SYMBOLS <fs_attr> TYPE any.

    IF io_data IS NOT BOUND.
      RETURN.
    ENDIF.

    DATA(lo_class_desc) = CAST cl_abap_classdescr( cl_abap_typedescr=>describe_by_object_ref( io_data ) ).

    LOOP AT lo_class_desc->attributes ASSIGNING FIELD-SYMBOL(<ls_attr>)
      WHERE visibility = cl_abap_classdescr=>public
        AND is_constant = abap_false.

      DATA(lv_path) = COND string( WHEN iv_path IS INITIAL THEN |{ <ls_attr>-name }|
                                   ELSE |{ iv_path }.{ <ls_attr>-name }| ).
      ASSIGN io_data->(<ls_attr>-name) TO <fs_attr>.
      IF sy-subrc = 0.
        APPEND VALUE #( path = lv_path
                        dref = REF #( <fs_attr> ) ) TO ct_node.
        resolve( EXPORTING iv_path = lv_path
                           iv_data = <fs_attr>
                 CHANGING  ct_node = ct_node ).
      ENDIF.
    ENDLOOP.
  ENDMETHOD.
ENDCLASS.
