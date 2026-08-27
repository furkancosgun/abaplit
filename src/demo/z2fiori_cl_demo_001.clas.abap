CLASS z2fiori_cl_demo_001 DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES z2fiori_if_app.

    DATA mv_user_name TYPE string VALUE 'World'.
    DATA mv_counter   TYPE i VALUE 0.
ENDCLASS.


CLASS z2fiori_cl_demo_001 IMPLEMENTATION.
  METHOD z2fiori_if_app~main.
    CASE client->get( )-event.
      WHEN 'INCREMENT'.
        mv_counter = mv_counter + 1.
        client->toast_display( |Counter incremented to { mv_counter }| ).

      WHEN 'RESET'.
        mv_counter = 0.
        client->toast_display( 'Counter reset' ).

      WHEN 'SAY_HELLO'.
        client->message_box_display( |Hello, { mv_user_name }! Welcome to abap2fiori.| ).
    ENDCASE.

    IF client->check_init( ) = abap_true.
      DATA(view) = z2fiori_cl_xml_view_builder=>factory( ).

      view->page( 'abap2fiori - Demo 001'
        )->simple_form( 'Interactive Demo'
          )->label( 'Your Name'
          )->input( client->bind( mv_user_name )
          )->button( text = 'Say Hello' press = client->event( 'SAY_HELLO' ) type = 'Emphasized'
          )->label( 'Counter'
          )->text( client->bind( mv_counter )
          )->button( text = '+1 Increment' press = client->event( 'INCREMENT' )
          )->button( text = 'Reset' press = client->event( 'RESET' ) type = 'Reject'
      ).

      client->view_display( view->stringify( ) ).
    ENDIF.
  ENDMETHOD.
ENDCLASS.
