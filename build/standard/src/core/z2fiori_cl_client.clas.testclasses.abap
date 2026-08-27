CLASS lcl_test_app_1 DEFINITION FINAL.
  PUBLIC SECTION.
    INTERFACES z2fiori_if_app.

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
    ms_state-text_input = 'abap2fiori Unit Test'.
    ms_state-count      = 1.
  ENDMETHOD.

  METHOD z2fiori_if_app~main.
    DATA lo_view TYPE REF TO z2fiori_cl_view_builder.
    IF client->check_event( 'INCREMENT' ) IS NOT INITIAL.
      ms_state-count = ms_state-count + 1.
      client->toast_display( |Count: { ms_state-count }| ).
    ENDIF.

    
    lo_view = z2fiori_cl_view_builder=>factory( )->ele( n  = 'View'
                                                              ns = 'mvc' ).
    lo_view->a( n = 'xmlns'
                v = 'sap.m'
      )->a( n = 'xmlns:mvc'
            v = 'sap.ui.core.mvc'
      )->ele( 'Button'
      )->a( n = 'text'
            v = 'Test App 1'
      )->a( n = 'press'
            v = client->event( 'INCREMENT' ) ).
    client->view_display( lo_view->stringify( ) ).
  ENDMETHOD.
ENDCLASS.


CLASS lcl_test_app_2 DEFINITION FINAL.
  PUBLIC SECTION.
    INTERFACES z2fiori_if_app.
ENDCLASS.


CLASS lcl_test_app_2 IMPLEMENTATION.
  METHOD z2fiori_if_app~main.
    client->view_display( '<Button text="Test App 2"/>' ).
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
    DATA ls_req     TYPE z2fiori_if_types=>ty_s_http_req.

    DATA lo_app TYPE REF TO lcl_test_app_1.
    DATA lo_cut TYPE REF TO z2fiori_cl_client.
    CREATE OBJECT lo_app TYPE lcl_test_app_1.
    
    CREATE OBJECT lo_cut TYPE z2fiori_cl_client EXPORTING app = lo_app req = ls_req.

    cl_abap_unit_assert=>assert_equals( exp = '{/MS_STATE/TEXT_INPUT}'
                                        act = lo_cut->z2fiori_if_client~bind( lo_app->ms_state-text_input ) ).

    TRY.
        lo_cut->z2fiori_if_client~bind( lv_unbound ).
        cl_abap_unit_assert=>fail( 'Expected z2fiori_cx_error was not raised' ).
      CATCH z2fiori_cx_error.
    ENDTRY.
  ENDMETHOD.

  METHOD test_request_getters.
    TYPES:
      BEGIN OF ty_s_ret_test,
        id     TYPE string,
        status TYPE string,
      END OF ty_s_ret_test.

    DATA ls_req      TYPE z2fiori_if_types=>ty_s_http_req.
    DATA ls_ret      TYPE ty_s_ret_test.

    DATA lt_args     TYPE string_table.
    DATA lt_row_args TYPE string_table.
    DATA lo_cut TYPE REF TO z2fiori_cl_client.
    DATA temp1 TYPE REF TO lcl_test_app_1.
    DATA lt_q TYPE z2fiori_if_types=>ty_t_query.
    DATA ls_dev TYPE z2fiori_if_types=>ty_s_device.
    DATA ls_cfg TYPE z2fiori_if_types=>ty_s_config.
    DATA lv_ev_str TYPE string.
    DATA ls_get TYPE z2fiori_if_types=>ty_s_http_req.

    APPEND '[{"name":"mode","value":"EDIT"},{"name":"id","value":"1001"}]' TO lt_args.
    APPEND '{"system":"Desktop","browser":{"name":"Chrome","version":"120"}}' TO lt_args.
    APPEND '{"origin":"http://localhost:3000","pathname":"/","search":"","hash":""}' TO lt_args.

    ls_req-event           = 'SELECT'.
    ls_req-event_args      = lt_args.
    ls_req-check_init      = abap_false.
    ls_req-check_navigated = abap_true.
    ls_req-nav_prev_arg    = '{"id":"101","status":"SAVED"}'.

    
    
    CREATE OBJECT temp1 TYPE lcl_test_app_1.
    CREATE OBJECT lo_cut TYPE z2fiori_cl_client EXPORTING app = temp1 req = ls_req.

    cl_abap_unit_assert=>assert_equals( exp = 'SELECT'
                                        act = lo_cut->z2fiori_if_client~get_event( ) ).

    cl_abap_unit_assert=>assert_equals( exp = '1001'
                                        act = lo_cut->z2fiori_if_client~get_query_param( 'id' ) ).

    cl_abap_unit_assert=>assert_equals( exp = 'EDIT'
                                        act = lo_cut->z2fiori_if_client~get_query_param( 'MODE' ) ).

    
    lt_q = lo_cut->z2fiori_if_client~get_query( 1 ).
    cl_abap_unit_assert=>assert_equals( exp = 2
                                        act = lines( lt_q ) ).

    
    ls_dev = lo_cut->z2fiori_if_client~get_device( 2 ).
    cl_abap_unit_assert=>assert_equals( exp = 'Desktop'
                                        act = ls_dev-system ).
    cl_abap_unit_assert=>assert_equals( exp = 'Chrome'
                                        act = ls_dev-browser-name ).

    
    ls_cfg = lo_cut->z2fiori_if_client~get_config( 3 ).
    cl_abap_unit_assert=>assert_equals( exp = 'http://localhost:3000'
                                        act = ls_cfg-origin ).

    cl_abap_unit_assert=>assert_true( lo_cut->z2fiori_if_client~check_navigated( ) ).
    cl_abap_unit_assert=>assert_false( lo_cut->z2fiori_if_client~check_event( 'OTHER' ) ).
    cl_abap_unit_assert=>assert_true( lo_cut->z2fiori_if_client~check_event( 'SELECT' ) ).

    
    lv_ev_str = lo_cut->z2fiori_if_client~event( 'ROW_CLICK' ).
    cl_abap_unit_assert=>assert_equals( exp = `onEvent('ROW_CLICK')`
                                        act = lv_ev_str ).

    APPEND 'ID_99' TO lt_row_args.
    lv_ev_str = lo_cut->z2fiori_if_client~event( event = 'ROW_CLICK'
                                                 t_arg = lt_row_args ).
    cl_abap_unit_assert=>assert_equals( exp = `onEvent('ROW_CLICK', 'ID_99')`
                                        act = lv_ev_str ).

    lo_cut->z2fiori_if_client~get_nav_prev_arg( IMPORTING result = ls_ret ).
    cl_abap_unit_assert=>assert_equals( exp = '101'
                                        act = ls_ret-id ).
    cl_abap_unit_assert=>assert_equals( exp = 'SAVED'
                                        act = ls_ret-status ).

    
    ls_get = lo_cut->z2fiori_if_client~get( ).
    cl_abap_unit_assert=>assert_equals( exp = 'SELECT'
                                        act = ls_get-event ).
    cl_abap_unit_assert=>assert_equals( exp = 3
                                        act = lines( ls_get-event_args ) ).
  ENDMETHOD.

  METHOD test_actions.
    DATA li_app TYPE REF TO z2fiori_if_app.
    DATA ls_req TYPE z2fiori_if_types=>ty_s_http_req.
    DATA lo_app TYPE REF TO lcl_test_app_1.
    DATA lo_cut TYPE REF TO z2fiori_cl_client.
    DATA lv_view TYPE string.
    DATA lt_actions TYPE z2fiori_if_types=>ty_t_action.
    DATA ls_action TYPE z2fiori_if_types=>ty_s_action.
    DATA lo_app2 TYPE REF TO lcl_test_app_2.
    DATA lv_b64 TYPE string.
    DATA lv_decoded_str TYPE string.
    DATA lt_final_actions TYPE z2fiori_if_types=>ty_t_action.

    ls_req-event = 'INCREMENT'.

    
    CREATE OBJECT lo_app TYPE lcl_test_app_1.
    
    CREATE OBJECT lo_cut TYPE z2fiori_cl_client EXPORTING app = lo_app req = ls_req.

    li_app ?= lo_app.
    li_app->main( lo_cut ).

    
    lv_view = lo_cut->z2fiori_if_client~get_view( ).
    
    lt_actions = lo_cut->z2fiori_if_client~get_actions( ).
    cl_abap_unit_assert=>assert_not_initial( lv_view ).
    cl_abap_unit_assert=>assert_not_initial( lt_actions ).

    
    READ TABLE lt_actions INTO ls_action INDEX 1.
    cl_abap_unit_assert=>assert_subrc( ).
    cl_abap_unit_assert=>assert_equals( exp = 'TOAST'
                                        act = ls_action-type ).

    lo_cut->z2fiori_if_client~popup_show( '<Button text="Popup Content"/>' ).
    lo_cut->z2fiori_if_client~popup_close( ).

    lo_cut->z2fiori_if_client~message_box_display( 'Confirm action?' ).
    lo_cut->z2fiori_if_client~file_download( filename = 'test.txt'
                                             base64   = 'QUJD' ).
    lo_cut->z2fiori_if_client~follow_up_action( event    = 'REFRESH'
                                                delay_ms = 500 ).

    
    CREATE OBJECT lo_app2 TYPE lcl_test_app_2.
    lo_cut->z2fiori_if_client~nav_call( lo_app2 ).

    lo_cut->z2fiori_if_client~nav_leave( '{"id":"101","status":"SAVED"}' ).

    
    lv_b64 = z2fiori_cl_util=>string_to_base64( 'Hello ABAP Cloud' ).
    cl_abap_unit_assert=>assert_not_initial( lv_b64 ).
    
    lv_decoded_str = z2fiori_cl_util=>base64_to_string( lv_b64 ).
    cl_abap_unit_assert=>assert_equals( exp = 'Hello ABAP Cloud'
                                        act = lv_decoded_str ).

    lo_cut->z2fiori_if_client~set_title( 'My New Title' ).
    lo_cut->z2fiori_if_client~set_favicon( '/favicon.ico' ).
    lo_cut->z2fiori_if_client~set_focus( 'my_input' ).
    lo_cut->z2fiori_if_client~scroll_into_view( 'my_section' ).
    lo_cut->z2fiori_if_client~clipboard_write( 'copied_text' ).
    lo_cut->z2fiori_if_client~clipboard_read( 'ON_PASTE' ).
    lo_cut->z2fiori_if_client~device_read( 'ON_DEVICE' ).
    lo_cut->z2fiori_if_client~location_read( 'ON_LOCATION' ).
    lo_cut->z2fiori_if_client~query_read( 'ON_QUERY' ).
    lo_cut->z2fiori_if_client~open_new_tab( 'https://sap.com' ).
    lo_cut->z2fiori_if_client~location_reload( ).
    lo_cut->z2fiori_if_client~set_dirty_state( abap_true ).
    lo_cut->z2fiori_if_client~keyboard_shortcut( key   = 's'
                                                 ctrl  = abap_true
                                                 event = 'SAVE' ).

    
    lt_final_actions = lo_cut->z2fiori_if_client~get_actions( ).
    cl_abap_unit_assert=>assert_not_initial( lt_final_actions ).
  ENDMETHOD.
ENDCLASS.
