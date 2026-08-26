CLASS lcl_codec_app DEFINITION FINAL.
  PUBLIC SECTION.
    INTERFACES z2fiori_if_app.

    TYPES:
      BEGIN OF ty_s_inner,
        label TYPE string,
        size  TYPE i,
      END OF ty_s_inner.

    DATA ms_data TYPE ty_s_inner.
    DATA mv_mode TYPE string.
ENDCLASS.


CLASS lcl_codec_app IMPLEMENTATION.
  METHOD z2fiori_if_app~main.
    client->view_display( '<Page/>' ).
  ENDMETHOD.
ENDCLASS.


CLASS ltcl_state_codec DEFINITION FINAL
  FOR TESTING RISK LEVEL HARMLESS DURATION SHORT.

  PRIVATE SECTION.
    METHODS test_serialize_uppercase FOR TESTING.
    METHODS test_hydrate_roundtrip   FOR TESTING.
    METHODS test_skip_empty_state    FOR TESTING.
ENDCLASS.


CLASS ltcl_state_codec IMPLEMENTATION.
  METHOD test_serialize_uppercase.
    DATA lo_app TYPE REF TO lcl_codec_app.
    CREATE OBJECT lo_app TYPE lcl_codec_app.
    lo_app->ms_data-label = 'Demo'.
    lo_app->ms_data-size  = 3.
    lo_app->mv_mode       = 'EDIT'.

    DATA lv_json TYPE string.
    lv_json = z2fiori_cl_state_codec=>serialize( lo_app ).

    TRY.
        DATA lo_ajson TYPE REF TO z2fiori_cl_ajson.
        lo_ajson = z2fiori_cl_ajson=>parse( lv_json ).
        cl_abap_unit_assert=>assert_equals( exp = 'Demo' act = lo_ajson->get_string( '/MS_DATA/LABEL' ) ).
        cl_abap_unit_assert=>assert_equals( exp = 3      act = lo_ajson->get_number( '/MS_DATA/SIZE' ) ).
        cl_abap_unit_assert=>assert_equals( exp = 'EDIT' act = lo_ajson->get_string( '/MV_MODE' ) ).
        cl_abap_unit_assert=>assert_false( lo_ajson->exists( '/ms_data' ) ).
      CATCH z2fiori_cx_ajson_error.
        cl_abap_unit_assert=>fail( 'Serialized state is not valid JSON' ).
    ENDTRY.
  ENDMETHOD.

  METHOD test_hydrate_roundtrip.
    DATA lo_app TYPE REF TO lcl_codec_app.
    CREATE OBJECT lo_app TYPE lcl_codec_app.

    z2fiori_cl_state_codec=>hydrate( app        = lo_app
                                     json_state = '{"MS_DATA":{"LABEL":"Hydrated","SIZE":9},"MV_MODE":"SHOW"}' ).

    cl_abap_unit_assert=>assert_equals( exp = 'Hydrated' act = lo_app->ms_data-label ).
    cl_abap_unit_assert=>assert_equals( exp = 9          act = lo_app->ms_data-size ).
    cl_abap_unit_assert=>assert_equals( exp = 'SHOW'     act = lo_app->mv_mode ).
  ENDMETHOD.

  METHOD test_skip_empty_state.
    DATA lo_app TYPE REF TO lcl_codec_app.
    CREATE OBJECT lo_app TYPE lcl_codec_app.
    lo_app->mv_mode = 'KEEP'.

    z2fiori_cl_state_codec=>hydrate( app        = lo_app
                                     json_state = '' ).
    z2fiori_cl_state_codec=>hydrate( app        = lo_app
                                     json_state = '{}' ).

    cl_abap_unit_assert=>assert_equals( exp = 'KEEP' act = lo_app->mv_mode ).
  ENDMETHOD.
ENDCLASS.
