CLASS zcl_abaplit_state_codec DEFINITION
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
    TYPES tt_names TYPE STANDARD TABLE OF string WITH EMPTY KEY.

    CLASS-METHODS descriptor
      IMPORTING app           TYPE REF TO object
      RETURNING VALUE(result) TYPE REF TO cl_abap_classdescr.

    CLASS-METHODS public_attribute_names
      IMPORTING app           TYPE REF TO object
      RETURNING VALUE(result) TYPE tt_names.
ENDCLASS.


CLASS zcl_abaplit_state_codec IMPLEMENTATION.
  METHOD hydrate.
    FIELD-SYMBOLS <ls_attr_val> TYPE any.

    IF json_state IS INITIAL OR json_state = '{}'.
      RETURN.
    ENDIF.

    TRY.
        DATA(lo_ajson) = zcl_abaplit_ajson=>parse( json_state ).
        DATA(lt_names) = public_attribute_names( app ).

        LOOP AT lt_names ASSIGNING FIELD-SYMBOL(<lv_name>).
          DATA(lv_path) = |/{ <lv_name> }|.

          IF lo_ajson->exists( lv_path ) = abap_true.
            ASSIGN app->(<lv_name>) TO <ls_attr_val>.
            IF sy-subrc = 0.
              lo_ajson->slice( lv_path )->to_abap( EXPORTING iv_corresponding = abap_true
                                                   IMPORTING ev_container     = <ls_attr_val> ).
            ENDIF.
          ENDIF.
        ENDLOOP.
      CATCH cx_root INTO DATA(lx_err).
        zcx_abaplit_error=>raise( val     = |Failed to hydrate application state: { lx_err->get_text( ) }|
                                 previous = lx_err ).
    ENDTRY.
  ENDMETHOD.

  METHOD serialize.
    FIELD-SYMBOLS <lv_val> TYPE any.

    TRY.
        DATA(lo_ajson) = zcl_abaplit_ajson=>create_empty( ).
        DATA(lt_names) = public_attribute_names( app ).

        LOOP AT lt_names ASSIGNING FIELD-SYMBOL(<lv_name>).
          ASSIGN app->(<lv_name>) TO <lv_val>.
          IF sy-subrc = 0.
            lo_ajson->set( iv_path         = |/{ <lv_name> }|
                           iv_val          = <lv_val>
                           iv_ignore_empty = abap_false ).
          ENDIF.
        ENDLOOP.

        result = lo_ajson->stringify( ).
      CATCH zcx_abaplit_ajson_error INTO DATA(lx_ajson).
        zcx_abaplit_error=>raise( val     = 'Failed to serialize application state to JSON.'
                                 previous = lx_ajson ).
    ENDTRY.
  ENDMETHOD.

  METHOD descriptor.
    result ?= cl_abap_typedescr=>describe_by_object_ref( app ).
  ENDMETHOD.

  METHOD public_attribute_names.
    DATA lo_desc TYPE REF TO cl_abap_classdescr.

    lo_desc = descriptor( app ).
    LOOP AT lo_desc->attributes ASSIGNING FIELD-SYMBOL(<ls_attr>)
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

