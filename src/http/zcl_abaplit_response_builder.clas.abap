CLASS zcl_abaplit_response_builder DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    CLASS-METHODS build
      IMPORTING res           TYPE zif_abaplit_types=>ty_s_http_res
      RETURNING VALUE(result) TYPE string.
ENDCLASS.


CLASS zcl_abaplit_response_builder IMPLEMENTATION.
  METHOD build.
    TRY.
        DATA(lo_ajson) = zcl_abaplit_ajson=>create_empty( ).
        lo_ajson->set_boolean( iv_path = '/success'
                               iv_val  = res-success ).
        lo_ajson->set_string( iv_path = '/app'
                              iv_val  = res-app ).
        lo_ajson->set_string( iv_path = '/view'
                              iv_val  = res-view ).
        lo_ajson->set_string( iv_path = '/state'
                              iv_val  = res-state ).
        lo_ajson->set( iv_path = '/t_actions'
                       iv_val  = res-t_actions ).
        lo_ajson->set_string( iv_path = '/message'
                              iv_val  = res-message ).

        result = lo_ajson->stringify( ).
      CATCH zcx_abaplit_ajson_error.
        result = '{"success":false,"message":"Response serialization failed."}'.
    ENDTRY.
  ENDMETHOD.
ENDCLASS.
