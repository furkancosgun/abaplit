CLASS zcl_abaplit_app_runner DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    CLASS-METHODS run
      IMPORTING req           TYPE zif_abaplit_types=>ty_s_http_req
      RETURNING VALUE(result) TYPE zif_abaplit_types=>ty_s_http_res.

  PRIVATE SECTION.
    CLASS-METHODS instantiate
      IMPORTING app_name      TYPE string
      RETURNING VALUE(result) TYPE REF TO object.
ENDCLASS.


CLASS zcl_abaplit_app_runner IMPLEMENTATION.
  METHOD run.
    DATA li_app TYPE REF TO zif_abaplit_app.

    result-app = req-app.

    IF result-app IS INITIAL.
      result-success = abap_false.
      result-message = 'Application name (app) is required.'.
      RETURN.
    ENDIF.

    TRY.
        DATA(lo_app) = instantiate( result-app ).

        TRY.
            li_app ?= lo_app.
          CATCH cx_sy_move_cast_error INTO DATA(lx_cast).
            zcx_abaplit_error=>raise(
                val      = |Application class '{ result-app }' must implement interface 'ZIF_ABAPLIT_APP'.|
                previous = lx_cast ).
        ENDTRY.

        zcl_abaplit_state_codec=>hydrate( app       = lo_app
                                         json_state = req-state ).

        DATA(lo_client) = NEW zcl_abaplit_client( app = lo_app
                                                 req  = req ).

        li_app->main( lo_client ).

        result-state     = zcl_abaplit_state_codec=>serialize( lo_app ).
        result-view      = lo_client->zif_abaplit_client~get_view( ).
        result-t_actions = lo_client->zif_abaplit_client~get_actions( ).
        result-success   = abap_true.

      CATCH cx_root INTO DATA(lx_err).
        result-success = abap_false.
        result-message = lx_err->get_text( ).
    ENDTRY.
  ENDMETHOD.

  METHOD instantiate.
    DATA(lv_class) = to_upper( app_name ).
    TRY.
        CREATE OBJECT result TYPE (lv_class).
      CATCH cx_root INTO DATA(lx_create).
        zcx_abaplit_error=>raise( val     = |Application class '{ app_name }' not found.|
                                 previous = lx_create ).
    ENDTRY.
  ENDMETHOD.
ENDCLASS.
