CLASS z2fiori_cl_state_codec DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    CLASS-METHODS hydrate
      IMPORTING app        TYPE REF TO object
                json_state TYPE string.

    CLASS-METHODS serialize
      IMPORTING app           TYPE REF TO object
      RETURNING VALUE(result) TYPE string.

    CLASS-METHODS get_classname
      IMPORTING app           TYPE REF TO object
      RETURNING VALUE(result) TYPE string.

  PRIVATE SECTION.
    CLASS-METHODS descriptor
      IMPORTING app           TYPE REF TO object
      RETURNING VALUE(result) TYPE REF TO cl_abap_classdescr.

    CLASS-METHODS public_attribute_names
      IMPORTING app           TYPE REF TO object
      RETURNING VALUE(result) TYPE string_table.
ENDCLASS.


CLASS z2fiori_cl_state_codec IMPLEMENTATION.
  METHOD hydrate.
    DATA lv_name TYPE string.
    DATA lv_path TYPE string.
    FIELD-SYMBOLS <ls_attr_val> TYPE any.

    IF json_state IS INITIAL OR json_state = '{}'.
      RETURN.
    ENDIF.

    TRY.
        DATA lo_ajson TYPE REF TO z2fiori_cl_ajson.
        lo_ajson = z2fiori_cl_ajson=>parse( json_state ).

        DATA(temp1) = public_attribute_names( app ).
        LOOP AT temp1 INTO lv_name.
          lv_path = |/{ lv_name }|.

          IF lo_ajson->exists( lv_path ) = abap_true.
            ASSIGN app->(lv_name) TO <ls_attr_val>.
            IF sy-subrc = 0.
              lo_ajson->slice( lv_path )->to_abap( EXPORTING iv_corresponding = abap_true
                                                   IMPORTING ev_container     = <ls_attr_val> ).
            ENDIF.
          ENDIF.
        ENDLOOP.
        DATA lx_err TYPE REF TO cx_root.
      CATCH cx_root INTO lx_err.
        z2fiori_cx_error=>raise( val      = |Failed to hydrate application state: { lx_err->get_text( ) }|
                                 previous = lx_err ).
    ENDTRY.
  ENDMETHOD.

  METHOD serialize.
    DATA lo_ajson TYPE REF TO z2fiori_cl_ajson.
    DATA lv_name  TYPE string.
    FIELD-SYMBOLS <lv_val> TYPE any.

    TRY.
        lo_ajson = z2fiori_cl_ajson=>create_empty( ).

        DATA(temp2) = public_attribute_names( app ).
        LOOP AT temp2 INTO lv_name.
          ASSIGN app->(lv_name) TO <lv_val>.
          IF sy-subrc = 0.
            lo_ajson->set( iv_path         = |/{ lv_name }|
                           iv_val          = <lv_val>
                           iv_ignore_empty = abap_false ).
          ENDIF.
        ENDLOOP.

        result = lo_ajson->stringify( ).
        DATA lx_ajson TYPE REF TO z2fiori_cx_ajson_error.
      CATCH z2fiori_cx_ajson_error INTO lx_ajson.
        z2fiori_cx_error=>raise( val      = 'Failed to serialize application state to JSON.'
                                 previous = lx_ajson ).
    ENDTRY.
  ENDMETHOD.

  METHOD descriptor.
    DATA temp3 TYPE REF TO cl_abap_classdescr.
    temp3 ?= cl_abap_typedescr=>describe_by_object_ref( app ).
    result = temp3.
  ENDMETHOD.

  METHOD public_attribute_names.
    DATA lo_desc TYPE REF TO cl_abap_classdescr.
    FIELD-SYMBOLS <ls_attr> TYPE abap_attrdescr.

    lo_desc = descriptor( app ).
    LOOP AT lo_desc->attributes ASSIGNING <ls_attr>
         WHERE visibility   = cl_abap_classdescr=>public
               AND is_interface = abap_false
               AND is_class     = abap_false
               AND is_constant  = abap_false.
      APPEND <ls_attr>-name TO result.
    ENDLOOP.
  ENDMETHOD.

  METHOD get_classname.
    result = cl_abap_typedescr=>describe_by_object_ref( app )->get_relative_name( ).
  ENDMETHOD.
ENDCLASS.