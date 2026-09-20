CLASS lcl_test_app_1 DEFINITION FINAL.
  PUBLIC SECTION.
    INTERFACES zif_abaplit_app.

    TYPES:
      BEGIN OF ty_s_state,
        text_input TYPE string,
        count      TYPE i,
      END OF ty_s_state.

    DATA ms_state TYPE ty_s_state.

    METHODS constructor.
ENDCLASS.


CLASS lcl_test_app_1 IMPLEMENTATION.
  METHOD constructor.
    ms_state-text_input = 'abaplit Unit Test'.
    ms_state-count      = 1.
  ENDMETHOD.

  METHOD zif_abaplit_app~main.
    IF client->check_event( 'INCREMENT' ).
      ms_state-count = ms_state-count + 1.
      client->toast_display( |Count: { ms_state-count }| ).
    ENDIF.

    DATA(lo_view) = client->new_view( ).
    lo_view->title( 'Test App 1' ).
    lo_view->button( text     = 'Test App 1'
                     on_click = client->event( 'INCREMENT' ) ).
    client->view_display( lo_view->stringify( ) ).
  ENDMETHOD.
ENDCLASS.


CLASS ltcl_client DEFINITION FINAL
  FOR TESTING RISK LEVEL HARMLESS DURATION SHORT.

  PRIVATE SECTION.
    METHODS test_bind            FOR TESTING.
    METHODS test_request_getters FOR TESTING.
    METHODS test_actions         FOR TESTING.
ENDCLASS.


CLASS ltcl_client IMPLEMENTATION.
  METHOD test_bind.
    DATA lv_unbound TYPE string.
    DATA ls_req     TYPE zif_abaplit_types=>ty_s_http_req.

    DATA(lo_app) = NEW lcl_test_app_1( ).
    DATA(lo_cut) = NEW zcl_abaplit_client( app = lo_app
                                          req  = ls_req ).

    cl_abap_unit_assert=>assert_equals( exp = '{MS_STATE.TEXT_INPUT}'
                                        act = lo_cut->zif_abaplit_client~bind( lo_app->ms_state-text_input ) ).

    TRY.
        lo_cut->zif_abaplit_client~bind( lv_unbound ).
        cl_abap_unit_assert=>fail( 'Expected zcx_abaplit_error was not raised' ).
      CATCH zcx_abaplit_error.
    ENDTRY.
  ENDMETHOD.

  METHOD test_request_getters.
    DATA ls_req      TYPE zif_abaplit_types=>ty_s_http_req.
    DATA lt_args     TYPE string_table.

    APPEND 'ARG1' TO lt_args.
    APPEND 'ARG2' TO lt_args.

    ls_req-app        = 'TEST_APP'.
    ls_req-event      = 'SELECT'.
    ls_req-event_args = lt_args.
    ls_req-check_init = abap_true.

    DATA(lo_cut) = NEW zcl_abaplit_client( app = NEW lcl_test_app_1( )
                                          req  = ls_req ).

    cl_abap_unit_assert=>assert_equals( exp = 'SELECT'
                                        act = lo_cut->zif_abaplit_client~get_event( ) ).

    cl_abap_unit_assert=>assert_equals( exp = 'ARG1'
                                        act = lo_cut->zif_abaplit_client~get_event_arg( 1 ) ).

    cl_abap_unit_assert=>assert_equals( exp = 'ARG2'
                                        act = lo_cut->zif_abaplit_client~get_event_arg( 2 ) ).

    cl_abap_unit_assert=>assert_true( lo_cut->zif_abaplit_client~check_init( ) ).
    cl_abap_unit_assert=>assert_true( lo_cut->zif_abaplit_client~check_event( 'SELECT' ) ).
    cl_abap_unit_assert=>assert_false( lo_cut->zif_abaplit_client~check_event( 'OTHER' ) ).

    DATA(lv_ev_str) = lo_cut->zif_abaplit_client~event( 'ROW_CLICK' ).
    cl_abap_unit_assert=>assert_equals( exp = `ROW_CLICK`
                                        act = lv_ev_str ).

    DATA(ls_get) = lo_cut->zif_abaplit_client~get( ).
    cl_abap_unit_assert=>assert_equals( exp = 'SELECT'
                                        act = ls_get-event ).
    cl_abap_unit_assert=>assert_equals( exp = 2
                                        act = lines( ls_get-event_args ) ).
  ENDMETHOD.

  METHOD test_actions.
    DATA li_app TYPE REF TO zif_abaplit_app.
    DATA ls_req TYPE zif_abaplit_types=>ty_s_http_req.

    ls_req-event = 'INCREMENT'.

    DATA(lo_app) = NEW lcl_test_app_1( ).
    DATA(lo_cut) = NEW zcl_abaplit_client( app = lo_app
                                          req  = ls_req ).

    li_app ?= lo_app.
    li_app->main( lo_cut ).

    DATA(lv_view) = lo_cut->zif_abaplit_client~get_view( ).
    DATA(lt_actions) = lo_cut->zif_abaplit_client~get_actions( ).
    cl_abap_unit_assert=>assert_not_initial( lv_view ).
    cl_abap_unit_assert=>assert_not_initial( lt_actions ).

    READ TABLE lt_actions INTO DATA(ls_action) INDEX 1.
    cl_abap_unit_assert=>assert_subrc( ).
    cl_abap_unit_assert=>assert_equals( exp = 'TOAST'
                                        act = ls_action-type ).

    lo_cut->zif_abaplit_client~file_download( filename = 'test.txt'
                                             base64    = 'QUJD' ).

    lo_cut->zif_abaplit_client~set_title( 'My New Title' ).
    lo_cut->zif_abaplit_client~clipboard_write( 'copied_text' ).
    lo_cut->zif_abaplit_client~open_new_tab( 'https://abaplit.dev' ).

    DATA(lt_final_actions) = lo_cut->zif_abaplit_client~get_actions( ).
    cl_abap_unit_assert=>assert_equals( exp = 5
                                        act = lines( lt_final_actions ) ).
  ENDMETHOD.
ENDCLASS.
