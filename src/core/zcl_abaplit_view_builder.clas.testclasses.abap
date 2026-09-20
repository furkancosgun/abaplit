CLASS ltcl_view_builder DEFINITION FINAL
  FOR TESTING RISK LEVEL HARMLESS DURATION SHORT.

  PRIVATE SECTION.
    METHODS test_title_and_text      FOR TESTING.
    METHODS test_button_and_inputs   FOR TESTING.
    METHODS test_columns_and_sidebar FOR TESTING.
    METHODS test_metric_and_feedback FOR TESTING.
ENDCLASS.


CLASS ltcl_view_builder IMPLEMENTATION.

  METHOD test_title_and_text.
    DATA(st) = zcl_abaplit_view_builder=>factory( ).
    st->title( 'Hello ABAPlit' ).
    st->write( 'Streamlit in ABAP' ).

    DATA(lv_json) = st->stringify( ).
    cl_abap_unit_assert=>assert_char_cp( act = lv_json
                                         exp = '*"type":"title"*"text":"Hello ABAPlit"*' ).
    cl_abap_unit_assert=>assert_char_cp( act = lv_json
                                         exp = '*"type":"write"*"text":"Streamlit in ABAP"*' ).
  ENDMETHOD.

  METHOD test_button_and_inputs.
    DATA(st) = zcl_abaplit_view_builder=>factory( ).
    st->text_input( label = 'Your Name' value = 'Furkan' on_change = 'INPUT_CHANGE' ).
    st->number_input( label = 'Age' value = '25' min = '0' max = '100' ).
    st->button( text = 'Submit' on_click = 'BTN_SUBMIT' type = 'primary' ).

    DATA(lv_json) = st->stringify( ).
    cl_abap_unit_assert=>assert_char_cp( act = lv_json
                                         exp = '*"type":"text_input"*"label":"Your Name"*"value":"Furkan"*' ).
    cl_abap_unit_assert=>assert_char_cp( act = lv_json
                                         exp = '*"type":"number_input"*"label":"Age"*"min":"0"*"max":"100"*' ).
    cl_abap_unit_assert=>assert_char_cp( act = lv_json
                                         exp = '*"type":"button"*"text":"Submit"*"on_click":"BTN_SUBMIT"*"btn_type":"primary"*' ).
  ENDMETHOD.

  METHOD test_columns_and_sidebar.
    DATA(st) = zcl_abaplit_view_builder=>factory( ).
    st->sidebar( )->write( 'Menu' ).
    DATA(cols) = st->columns( 2 ).
    cols->col( 1 )->metric( label = 'Sales' value = '$100' ).
    cols->col( 2 )->metric( label = 'Users' value = '42' ).

    DATA(lv_json) = st->stringify( ).
    cl_abap_unit_assert=>assert_char_cp( act = lv_json
                                         exp = '*"type":"sidebar"*"text":"Menu"*' ).
    cl_abap_unit_assert=>assert_char_cp( act = lv_json
                                         exp = '*"type":"columns"*"count":"2"*' ).
    cl_abap_unit_assert=>assert_char_cp( act = lv_json
                                         exp = '*"label":"Sales"*"value":"$100"*' ).
  ENDMETHOD.

  METHOD test_metric_and_feedback.
    DATA(st) = zcl_abaplit_view_builder=>factory( ).
    st->success( 'Operation succeeded' ).
    st->error( 'Something went wrong' ).
    st->balloons( ).

    DATA(lv_json) = st->stringify( ).
    cl_abap_unit_assert=>assert_char_cp( act = lv_json
                                         exp = '*"type":"success"*"text":"Operation succeeded"*' ).
    cl_abap_unit_assert=>assert_char_cp( act = lv_json
                                         exp = '*"type":"error"*"text":"Something went wrong"*' ).
    cl_abap_unit_assert=>assert_char_cp( act = lv_json
                                         exp = '*"type":"balloons"*' ).
  ENDMETHOD.

ENDCLASS.
