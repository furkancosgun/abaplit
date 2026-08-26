CLASS lcl_event_helper IMPLEMENTATION.
  METHOD js_quote.
    IF val CP '${*}'.
      result = val.
      RETURN.
    ENDIF.

    result = val.
    REPLACE ALL OCCURRENCES OF `\` IN result WITH `\\`.
    REPLACE ALL OCCURRENCES OF `'` IN result WITH `\'`.
    result = |'{ result }'|.
  ENDMETHOD.

  METHOD event.
    DATA lv_args TYPE string.
    DATA lv_arg  TYPE string.

    LOOP AT t_arg INTO lv_arg.
      lv_args = |{ lv_args }, { js_quote( lv_arg ) }|.
    ENDLOOP.

    result = |onEvent({ js_quote( event ) }{ lv_args })|.
  ENDMETHOD.
ENDCLASS.


CLASS lcl_request_reader IMPLEMENTATION.
  METHOD find_query_param.
    DATA ls_query TYPE z2fiori_if_types=>ty_s_query.
    DATA lv_name  TYPE string.

    lv_name = name.

    READ TABLE it_query INTO ls_query WITH KEY name = lv_name.
    IF sy-subrc = 0.
      result = ls_query-value.
      RETURN.
    ENDIF.

    READ TABLE it_query INTO ls_query WITH KEY name = to_lower( lv_name ).
    IF sy-subrc = 0.
      result = ls_query-value.
      RETURN.
    ENDIF.

    READ TABLE it_query INTO ls_query WITH KEY name = to_upper( lv_name ).
    IF sy-subrc = 0.
      result = ls_query-value.
    ENDIF.
  ENDMETHOD.

  METHOD get_query.
    DATA lo_ajson TYPE REF TO z2fiori_cl_ajson.
    DATA lv_json  TYPE string.

    lv_json = iv_json.
    IF lv_json IS INITIAL.
      RETURN.
    ENDIF.

    TRY.
        lo_ajson = z2fiori_cl_ajson=>parse( lv_json ).
        lo_ajson->to_abap( EXPORTING iv_corresponding = abap_true
                           IMPORTING ev_container     = result ).
      CATCH z2fiori_cx_ajson_error.
    ENDTRY.
  ENDMETHOD.

  METHOD get_config.
    DATA lo_ajson TYPE REF TO z2fiori_cl_ajson.
    DATA lv_json  TYPE string.

    lv_json = iv_json.
    IF lv_json IS INITIAL.
      RETURN.
    ENDIF.

    TRY.
        lo_ajson = z2fiori_cl_ajson=>parse( lv_json ).
        lo_ajson->to_abap( EXPORTING iv_corresponding = abap_true
                           IMPORTING ev_container     = result ).
      CATCH z2fiori_cx_ajson_error.
    ENDTRY.
  ENDMETHOD.

  METHOD get_device.
    DATA lo_ajson TYPE REF TO z2fiori_cl_ajson.
    DATA lv_json  TYPE string.

    lv_json = iv_json.
    IF lv_json IS INITIAL.
      RETURN.
    ENDIF.

    TRY.
        lo_ajson = z2fiori_cl_ajson=>parse( lv_json ).
        lo_ajson->to_abap( EXPORTING iv_corresponding = abap_true
                           IMPORTING ev_container     = result ).
      CATCH z2fiori_cx_ajson_error.
    ENDTRY.
  ENDMETHOD.

  METHOD get_nav_prev_arg.
    DATA lo_ajson TYPE REF TO z2fiori_cl_ajson.
    DATA lx_ajson TYPE REF TO z2fiori_cx_ajson_error.

    IF iv_nav_prev_arg IS INITIAL.
      RETURN.
    ENDIF.

    TRY.
        lo_ajson = z2fiori_cl_ajson=>parse( iv_nav_prev_arg ).
        lo_ajson->to_abap( EXPORTING iv_corresponding = abap_true
                           IMPORTING ev_container     = result ).
      CATCH z2fiori_cx_ajson_error INTO lx_ajson.
        z2fiori_cx_error=>raise( val      = 'Failed to parse previous app return data.'
                                 previous = lx_ajson ).
    ENDTRY.
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

  METHOD popup_show.
    add_action( n = 'POPUP'
                p = xml ).
  ENDMETHOD.

  METHOD popup_close.
    add_action( 'POPUP_CLOSE' ).
  ENDMETHOD.

  METHOD popups_close_all.
    add_action( 'POPUPS_CLOSE_ALL' ).
  ENDMETHOD.

  METHOD nest_view_display.
    TYPES:
      BEGIN OF ty_s_nest_view,
        id            TYPE string,
        xml           TYPE string,
        method_insert TYPE string,
      END OF ty_s_nest_view.
    DATA ls_nest_view TYPE ty_s_nest_view.

    ls_nest_view-id            = id.
    ls_nest_view-xml           = xml.
    ls_nest_view-method_insert = method_insert.
    add_action( n = 'NEST_VIEW_DISPLAY'
                p = ls_nest_view ).
  ENDMETHOD.

  METHOD nest_view_destroy.
    TYPES:
      BEGIN OF ty_s_nest_destroy,
        id             TYPE string,
        method_destroy TYPE string,
      END OF ty_s_nest_destroy.
    DATA ls_nest_destroy TYPE ty_s_nest_destroy.

    ls_nest_destroy-id             = id.
    ls_nest_destroy-method_destroy = method_destroy.
    add_action( n = 'NEST_VIEW_DESTROY'
                p = ls_nest_destroy ).
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

  METHOD message_box_display.
    TYPES:
      BEGIN OF ty_s_msg_box,
        text          TYPE string,
        title         TYPE string,
        level         TYPE string,
        confirm_event TYPE string,
        cancel_event  TYPE string,
      END OF ty_s_msg_box.
    DATA ls_msg_box TYPE ty_s_msg_box.

    ls_msg_box-text          = |{ text }|.
    ls_msg_box-title         = title.
    ls_msg_box-level         = type.
    ls_msg_box-confirm_event = confirm_event.
    ls_msg_box-cancel_event  = cancel_event.
    add_action( n = 'MESSAGE_BOX'
                p = ls_msg_box ).
  ENDMETHOD.

  METHOD set_title.
    add_action( n = 'TITLE'
                p = title ).
  ENDMETHOD.

  METHOD set_favicon.
    add_action( n = 'FAVICON'
                p = url ).
  ENDMETHOD.

  METHOD set_focus.
    add_action( n = 'FOCUS'
                p = id ).
  ENDMETHOD.

  METHOD scroll_into_view.
    add_action( n = 'SCROLL'
                p = id ).
  ENDMETHOD.

  METHOD clipboard_write.
    add_action( n = 'CLIPBOARD_WRITE'
                p = text ).
  ENDMETHOD.

  METHOD clipboard_read.
    add_action( n = 'CLIPBOARD_READ'
                p = event ).
  ENDMETHOD.

  METHOD device_read.
    add_action( n = 'DEVICE_READ'
                p = event ).
  ENDMETHOD.

  METHOD location_read.
    add_action( n = 'LOCATION_READ'
                p = event ).
  ENDMETHOD.

  METHOD query_read.
    add_action( n = 'QUERY_READ'
                p = event ).
  ENDMETHOD.

  METHOD open_new_tab.
    add_action( n = 'OPEN_URL'
                p = url ).
  ENDMETHOD.

  METHOD location_reload.
    add_action( 'RELOAD' ).
  ENDMETHOD.

  METHOD set_dirty_state.
    add_action( n = 'DIRTY'
                p = is_dirty ).
  ENDMETHOD.

  METHOD keyboard_shortcut.
    TYPES:
      BEGIN OF ty_s_shortcut,
        key        TYPE string,
        ctrl       TYPE abap_bool,
        alt        TYPE abap_bool,
        shift      TYPE abap_bool,
        event      TYPE string,
        event_args TYPE string_table,
      END OF ty_s_shortcut.
    DATA ls_shortcut TYPE ty_s_shortcut.

    ls_shortcut-key        = key.
    ls_shortcut-ctrl       = ctrl.
    ls_shortcut-alt        = alt.
    ls_shortcut-shift      = shift.
    ls_shortcut-event      = event.
    ls_shortcut-event_args = event_args.
    add_action( n = 'SHORTCUTS'
                p = ls_shortcut ).
  ENDMETHOD.

  METHOD add_script.
    add_action( n = 'SCRIPT'
                p = url ).
  ENDMETHOD.

  METHOD add_style.
    add_action( n = 'STYLE'
                p = url ).
  ENDMETHOD.

  METHOD file_download.
    TYPES:
      BEGIN OF ty_s_file_download,
        filename TYPE string,
        base64   TYPE string,
        type     TYPE string,
      END OF ty_s_file_download.
    DATA ls_file TYPE ty_s_file_download.

    ls_file-filename = filename.
    ls_file-base64   = base64.
    ls_file-type     = type.
    add_action( n = 'DOWNLOAD'
                p = ls_file ).
  ENDMETHOD.

  METHOD follow_up_action.
    TYPES:
      BEGIN OF ty_s_follow_up,
        event      TYPE string,
        event_args TYPE string_table,
        delay_ms   TYPE i,
      END OF ty_s_follow_up.
    DATA ls_follow_up TYPE ty_s_follow_up.

    ls_follow_up-event      = event.
    ls_follow_up-event_args = event_args.
    ls_follow_up-delay_ms   = delay_ms.
    add_action( n = 'FOLLOW_UP'
                p = ls_follow_up ).
  ENDMETHOD.

  METHOD nav_call.
    TYPES:
      BEGIN OF ty_s_nav_payload,
        app   TYPE string,
        state TYPE string,
      END OF ty_s_nav_payload.
    DATA ls_nav_payload TYPE ty_s_nav_payload.

    ls_nav_payload-app   = z2fiori_cl_state_codec=>get_classname( app ).
    ls_nav_payload-state = z2fiori_cl_state_codec=>serialize( app ).

    add_action( n = 'NAV_CALL'
                p = ls_nav_payload ).
  ENDMETHOD.

  METHOD nav_leave.
    DATA lv_result TYPE string.
    DATA lo_ajson  TYPE REF TO z2fiori_cl_ajson.

    IF result IS SUPPLIED.
      TRY.
          lo_ajson = z2fiori_cl_ajson=>create_empty( ).
          lo_ajson->set( iv_path = '/'
                         iv_val  = result ).
          lv_result = lo_ajson->stringify( ).
        CATCH z2fiori_cx_ajson_error.
          lv_result = |{ result }|.
      ENDTRY.
    ENDIF.
    add_action( n = 'NAV_LEAVE'
                p = lv_result ).
  ENDMETHOD.
ENDCLASS.


CLASS lcl_binding_resolver IMPLEMENTATION.
  METHOD constructor.
    mo_app = io_app.
  ENDMETHOD.

  METHOD bind.
    DATA lr_val TYPE REF TO data.
    FIELD-SYMBOLS <fs_node> TYPE ty_s_node.

    IF mt_nodes IS INITIAL.
      resolve( EXPORTING iv_path = ''
                         iv_data = mo_app
               CHANGING  ct_node = mt_nodes ).
    ENDIF.

    GET REFERENCE OF val INTO lr_val.

    ASSIGN mt_nodes[ dref = lr_val ] TO <fs_node>.
    IF sy-subrc <> 0.
      z2fiori_cx_error=>raise( 'Binding error: Variable reference not found in registered app state.' ).
    ENDIF.

    result = |\{/{ <fs_node>-path }\}|.
  ENDMETHOD.

  METHOD resolve.
    DATA lo_refdescr    TYPE REF TO cl_abap_refdescr.
    DATA lr_data        TYPE REF TO data.
    DATA lo_typedescr   TYPE REF TO cl_abap_typedescr.
    DATA lo_structdescr TYPE REF TO cl_abap_structdescr.

    lo_typedescr = cl_abap_typedescr=>describe_by_data( iv_data ).

    IF iv_path IS NOT INITIAL.
      GET REFERENCE OF iv_data INTO lr_data.
      INSERT VALUE #( path = iv_path
                      dref = lr_data ) INTO TABLE ct_node.
    ENDIF.

    CASE lo_typedescr->kind.
      WHEN cl_abap_typedescr=>kind_struct.
        lo_structdescr ?= lo_typedescr.
        resolve_struct( EXPORTING iv_path = iv_path
                                  iv_data = iv_data
                                  io_desc = lo_structdescr
                        CHANGING  ct_node = ct_node ).

      WHEN cl_abap_typedescr=>kind_ref.
        lo_refdescr = CAST cl_abap_refdescr( lo_typedescr ).

        CASE lo_refdescr->type_kind.
          WHEN cl_abap_typedescr=>typekind_dref.
            resolve_dref( EXPORTING iv_path = iv_path
                                    ir_data = iv_data
                          CHANGING  ct_node = ct_node ).

          WHEN cl_abap_typedescr=>typekind_oref.
            resolve_oref( EXPORTING iv_path = iv_path
                                    io_data = iv_data
                          CHANGING  ct_node = ct_node ).
        ENDCASE.
    ENDCASE.
  ENDMETHOD.

  METHOD resolve_dref.
    FIELD-SYMBOLS <fs_any> TYPE any.

    IF ir_data IS NOT BOUND.
      RETURN.
    ENDIF.

    ASSIGN ir_data->* TO <fs_any>.
    IF sy-subrc = 0 AND <fs_any> IS ASSIGNED.
      resolve( EXPORTING iv_path = iv_path
                         iv_data = <fs_any>
               CHANGING  ct_node = ct_node ).
    ENDIF.
  ENDMETHOD.

  METHOD resolve_oref.
    DATA lr_object     TYPE REF TO object.
    DATA lv_path       TYPE string.
    DATA lo_classdescr TYPE REF TO cl_abap_classdescr.
    FIELD-SYMBOLS <fs_obj>  TYPE REF TO object.
    FIELD-SYMBOLS <fs_attr> TYPE abap_attrdescr.
    FIELD-SYMBOLS <fs_any>  TYPE any.

    IF io_data IS NOT BOUND.
      RETURN.
    ENDIF.

    lo_classdescr = CAST cl_abap_classdescr( cl_abap_typedescr=>describe_by_object_ref( io_data ) ).
    lr_object ?= io_data.
    ASSIGN lr_object TO <fs_obj>.
    IF sy-subrc <> 0.
      RETURN.
    ENDIF.

    LOOP AT lo_classdescr->attributes ASSIGNING <fs_attr>
         WHERE visibility   = cl_abap_classdescr=>public
           AND is_interface = abap_false
           AND is_class     = abap_false
           AND is_constant  = abap_false.

      ASSIGN <fs_obj>->(<fs_attr>-name) TO <fs_any>.
      IF sy-subrc = 0.
        IF iv_path IS NOT INITIAL.
          lv_path = |{ iv_path }/{ <fs_attr>-name }|.
        ELSE.
          lv_path = <fs_attr>-name.
        ENDIF.
        resolve( EXPORTING iv_path = lv_path
                           iv_data = <fs_any>
                 CHANGING  ct_node = ct_node ).
      ENDIF.
    ENDLOOP.
  ENDMETHOD.

  METHOD resolve_struct.
    DATA lv_sub_path TYPE string.
    FIELD-SYMBOLS <fs_comp> TYPE abap_compdescr.
    FIELD-SYMBOLS <fs_any>  TYPE any.

    LOOP AT io_desc->components ASSIGNING <fs_comp>.
      ASSIGN COMPONENT <fs_comp>-name OF STRUCTURE iv_data TO <fs_any>.
      IF sy-subrc = 0.
        IF iv_path IS INITIAL.
          lv_sub_path = <fs_comp>-name.
        ELSE.
          lv_sub_path = |{ iv_path }/{ <fs_comp>-name }|.
        ENDIF.
        resolve( EXPORTING iv_path = lv_sub_path
                           iv_data = <fs_any>
                 CHANGING  ct_node = ct_node ).
      ENDIF.
    ENDLOOP.
  ENDMETHOD.
ENDCLASS.