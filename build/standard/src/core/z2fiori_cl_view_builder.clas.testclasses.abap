CLASS ltcl_view_builder DEFINITION FINAL
  FOR TESTING RISK LEVEL HARMLESS DURATION SHORT.

  PRIVATE SECTION.
    METHODS test_empty_root_and_view FOR TESTING.
    METHODS test_ele_descend         FOR TESTING.
    METHODS test_tag_sibling_and_a   FOR TESTING.
    METHODS test_boolean_attr        FOR TESTING.
    METHODS test_attribute_escape    FOR TESTING.
    METHODS test_stringify_from_root FOR TESTING.
ENDCLASS.


CLASS ltcl_view_builder IMPLEMENTATION.
  METHOD test_empty_root_and_view.
    DATA lo_cut TYPE REF TO z2fiori_cl_view_builder.
    lo_cut = z2fiori_cl_view_builder=>factory( )->ele( n  = 'View'
                                                             ns = 'mvc' ).
    lo_cut->a( n = 'xmlns'
               v = 'sap.m' ).

    cl_abap_unit_assert=>assert_equals( exp = '<mvc:View xmlns="sap.m"/>'
                                        act = lo_cut->stringify( ) ).
  ENDMETHOD.

  METHOD test_ele_descend.
    DATA lo_cut TYPE REF TO z2fiori_cl_view_builder.
    DATA lo_btn TYPE REF TO z2fiori_cl_view_builder.
    lo_cut = z2fiori_cl_view_builder=>factory( )->ele( 'Page' ).
    
    lo_btn = lo_cut->ele( 'Button' ).
    lo_btn->a( n = 'text'
               v = 'Click' ).
    lo_btn->end( )->ele( 'Title' )->a( n = 'text'
                                       v = 'T' ).

    cl_abap_unit_assert=>assert_equals( exp = '<Page><Button text="Click"/><Title text="T"/></Page>'
                                        act = lo_cut->stringify( ) ).
  ENDMETHOD.

  METHOD test_tag_sibling_and_a.
    DATA lo_cut TYPE REF TO z2fiori_cl_view_builder.
    lo_cut = z2fiori_cl_view_builder=>factory( )->ele( 'VBox' ).
    lo_cut->ele( 'Button' )->a( n = 'text'
                                v = 'Click' ).
    lo_cut->tag( 'Text' )->a( n = 'text'
                              v = 'Hello' ).
    lo_cut->tag( 'Text' ).

    cl_abap_unit_assert=>assert_equals( exp = '<VBox><Button text="Click"/><Text text="Hello"/><Text/></VBox>'
                                        act = lo_cut->stringify( ) ).
  ENDMETHOD.

  METHOD test_boolean_attr.
    DATA lo_cut TYPE REF TO z2fiori_cl_view_builder.
    lo_cut = z2fiori_cl_view_builder=>factory( )->ele( 'Input' ).
    lo_cut->a( n = 'visible'
               b = abap_true
      )->a( n = 'editable'
            b = abap_false
      )->a( n = 'value'
            v = 'X' ).

    cl_abap_unit_assert=>assert_equals( exp = '<Input visible="true" editable="false" value="X"/>'
                                        act = lo_cut->stringify( ) ).
  ENDMETHOD.

  METHOD test_attribute_escape.
    DATA lo_cut TYPE REF TO z2fiori_cl_view_builder.
    lo_cut = z2fiori_cl_view_builder=>factory( )->ele( 'Button' ).
    lo_cut->a( n = 'press'
               v = `.onEvent('A&B<C>"D')` ).

    cl_abap_unit_assert=>assert_equals( exp = '<Button press=".onEvent(&apos;A&amp;B&lt;C>&quot;D&apos;)"/>'
                                        act = lo_cut->stringify( ) ).
  ENDMETHOD.

  METHOD test_stringify_from_root.
    DATA lo_view TYPE REF TO z2fiori_cl_view_builder.
    DATA lo_deep TYPE REF TO z2fiori_cl_view_builder.
    lo_view = z2fiori_cl_view_builder=>factory( )->ele( n  = 'View'
                                                              ns = 'mvc' ).
    
    lo_deep = lo_view->ele( 'Page' )->ele( 'Content' )->ele( 'Text' ).
    lo_deep->a( n = 'text'
                v = 'deep' ).

    cl_abap_unit_assert=>assert_equals( exp = '<mvc:View><Page><Content><Text text="deep"/></Content></Page></mvc:View>'
                                        act = lo_deep->stringify( ) ).
  ENDMETHOD.
ENDCLASS.
