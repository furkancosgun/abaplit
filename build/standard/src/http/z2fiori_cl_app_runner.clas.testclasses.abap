CLASS lcl_test_app DEFINITION FINAL.
  PUBLIC SECTION.
    INTERFACES z2fiori_if_app.

    TYPES:
      BEGIN OF ty_s_state,
        count      TYPE i,
        text_input TYPE string,
      END OF ty_s_state.

    DATA ms_state TYPE ty_s_state.
ENDCLASS.

CLASS lcl_test_app IMPLEMENTATION.
  METHOD z2fiori_if_app~main.
    IF client->get( )-check_init = abap_true.
      ms_state-count = 1.
      client->view_display( '<mvc:View><Text text="Test App 1"/></mvc:View>' ).
      RETURN.
    ENDIF.

    IF client->get( )-event = 'DEMO'.
      ms_state-count = ms_state-count + 1.
      client->toast_display( 'Demo event called' ).
    ENDIF.
  ENDMETHOD.
ENDCLASS.


CLASS ltcl_app_runner DEFINITION FINAL
  FOR TESTING RISK LEVEL HARMLESS DURATION SHORT.

  PRIVATE SECTION.
    METHODS test_init_roundtrip  FOR TESTING.
    METHODS test_event_roundtrip FOR TESTING.
    METHODS test_unknown_app     FOR TESTING.
ENDCLASS.


CLASS ltcl_app_runner IMPLEMENTATION.
  METHOD test_init_roundtrip.
    DATA ls_req TYPE z2fiori_if_types=>ty_s_http_req.
    ls_req-app        = 'LCL_TEST_APP'.
    ls_req-check_init = abap_true.

    DATA ls_res TYPE z2fiori_if_types=>ty_s_http_res.
    ls_res = z2fiori_cl_app_runner=>run( ls_req ).

    cl_abap_unit_assert=>assert_true( ls_res-success ).
    cl_abap_unit_assert=>assert_equals( exp = 'LCL_TEST_APP' act = ls_res-app ).
    cl_abap_unit_assert=>assert_true( contains( val = ls_res-view
                                                sub = 'Test App 1' ) ).
    cl_abap_unit_assert=>assert_true( contains( val = ls_res-state
                                                sub = '"COUNT":1' ) ).
  ENDMETHOD.

  METHOD test_event_roundtrip.
    DATA ls_req TYPE z2fiori_if_types=>ty_s_http_req.
    ls_req-app        = 'LCL_TEST_APP'.
    ls_req-event      = 'DEMO'.
    ls_req-check_init = abap_false.
    ls_req-state      = '{"MS_STATE":{"COUNT":5,"TEXT_INPUT":"abc"}}'.

    DATA ls_res TYPE z2fiori_if_types=>ty_s_http_res.
    ls_res = z2fiori_cl_app_runner=>run( ls_req ).

    cl_abap_unit_assert=>assert_true( ls_res-success ).
    cl_abap_unit_assert=>assert_true( contains( val = ls_res-state
                                                sub = '"COUNT":6' ) ).
    cl_abap_unit_assert=>assert_equals( exp = 1
                                        act = lines( ls_res-t_actions ) ).

    DATA ls_action TYPE z2fiori_if_types=>ty_s_action.
    READ TABLE ls_res-t_actions INTO ls_action INDEX 1.
    cl_abap_unit_assert=>assert_subrc( ).
    cl_abap_unit_assert=>assert_equals( exp = 'TOAST' act = ls_action-type ).
  ENDMETHOD.

  METHOD test_unknown_app.
    DATA ls_req TYPE z2fiori_if_types=>ty_s_http_req.
    ls_req-app   = 'ZCL_DOES_NOT_EXIST_XY'.
    ls_req-event = ''.

    DATA ls_res TYPE z2fiori_if_types=>ty_s_http_res.
    ls_res = z2fiori_cl_app_runner=>run( ls_req ).
    cl_abap_unit_assert=>assert_false( ls_res-success ).
    cl_abap_unit_assert=>assert_not_initial( ls_res-message ).
  ENDMETHOD.
ENDCLASS.
