CLASS ltcl_util DEFINITION FINAL
  FOR TESTING RISK LEVEL HARMLESS DURATION SHORT.

  PRIVATE SECTION.
    METHODS test_utf8_roundtrip   FOR TESTING.
    METHODS test_base64_roundtrip FOR TESTING.
    METHODS test_unicode_base64   FOR TESTING.
ENDCLASS.


CLASS ltcl_util IMPLEMENTATION.
  METHOD test_utf8_roundtrip.
    DATA lv_xstr TYPE xstring.
    lv_xstr = z2fiori_cl_util=>string_to_xstring_utf8( 'abc' ).
    cl_abap_unit_assert=>assert_equals( exp = '616263'
                                        act = lv_xstr ).

    cl_abap_unit_assert=>assert_equals( exp = 'abc'
                                        act = z2fiori_cl_util=>xstring_to_string_utf8( lv_xstr ) ).
  ENDMETHOD.

  METHOD test_base64_roundtrip.
    DATA lv_b64 TYPE string.
    lv_b64 = z2fiori_cl_util=>string_to_base64( 'Hello abap2fiori' ).
    cl_abap_unit_assert=>assert_equals( exp = 'SGVsbG8gYWJhcDJmaW9yaQ=='
                                        act = lv_b64 ).

    cl_abap_unit_assert=>assert_equals( exp = 'Hello abap2fiori'
                                        act = z2fiori_cl_util=>base64_to_string( lv_b64 ) ).
  ENDMETHOD.

  METHOD test_unicode_base64.
    DATA lv_text TYPE string.
    lv_text = z2fiori_cl_util=>xstring_to_string_utf8( 'C3A4C3B6C3BC' ).

    cl_abap_unit_assert=>assert_not_initial( lv_text ).
    cl_abap_unit_assert=>assert_equals(
        exp = lv_text
        act = z2fiori_cl_util=>base64_to_string( z2fiori_cl_util=>string_to_base64( lv_text ) ) ).
  ENDMETHOD.
ENDCLASS.
