CLASS z2fiori_cl_app_runner DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    CLASS-METHODS run
      IMPORTING req           TYPE z2fiori_if_types=>ty_s_http_req
      RETURNING VALUE(result) TYPE z2fiori_if_types=>ty_s_http_res.

  PRIVATE SECTION.
    CLASS-METHODS instantiate
      IMPORTING app_name      TYPE string
      RETURNING VALUE(result) TYPE REF TO object.
ENDCLASS.


CLASS z2fiori_cl_app_runner IMPLEMENTATION.
  METHOD run.
    DATA lo_app    TYPE REF TO object.
    DATA li_app    TYPE REF TO z2fiori_if_app.
    DATA lo_client TYPE REF TO z2fiori_if_client.
    DATA lx_cast   TYPE REF TO cx_sy_move_cast_error.
    DATA lx_err    TYPE REF TO cx_root.

    result-app = req-app.

    IF result-app IS INITIAL.
      result-success = abap_false.
      result-message = 'Application name (app) is required.'.
      RETURN.
    ENDIF.

    TRY.
        lo_app = instantiate( result-app ).

        TRY.
            li_app ?= lo_app.
          CATCH cx_sy_move_cast_error INTO lx_cast.
            z2fiori_cx_error=>raise( val      = |Application class '{ result-app }' must implement interface 'Z2FIORI_IF_APP'.|
                                     previous = lx_cast ).
        ENDTRY.

        z2fiori_cl_state_codec=>hydrate( app        = lo_app
                                         json_state = req-state ).

        lo_client = NEW z2fiori_cl_client( app = lo_app
                                           req = req ).

        li_app->main( lo_client ).

        result-state     = z2fiori_cl_state_codec=>serialize( lo_app ).
        result-view      = lo_client->get_view( ).
        result-t_actions = lo_client->get_actions( ).
        result-success   = abap_true.

      CATCH cx_root INTO lx_err.
        result-success = abap_false.
        result-message = lx_err->get_text( ).
    ENDTRY.
  ENDMETHOD.

  METHOD instantiate.
    DATA lv_class  TYPE string.
    DATA lx_create TYPE REF TO cx_sy_create_object_error.

    lv_class = to_upper( app_name ).
    TRY.
        CREATE OBJECT result TYPE (lv_class).
      CATCH cx_sy_create_object_error INTO lx_create.
        z2fiori_cx_error=>raise( val      = |Application class '{ app_name }' not found.|
                                 previous = lx_create ).
    ENDTRY.
  ENDMETHOD.
ENDCLASS.