CLASS zcl_abaplit_demo DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES zif_abaplit_app.

    DATA mv_user_name TYPE string VALUE 'Developer'.
    DATA mv_counter   TYPE i VALUE 0.
    DATA mv_checked   TYPE abap_bool VALUE abap_true.
    DATA mv_slider    TYPE string VALUE '50'.
    DATA mv_text_area TYPE string VALUE 'Streamlit in ABAP is awesome!'.

ENDCLASS.


CLASS zcl_abaplit_demo IMPLEMENTATION.

  METHOD zif_abaplit_app~main.
    DATA(st) = client->new_view( ).

    " Sidebar Area
    st->sidebar( )->title( 'ABAPlit Console' ).
    st->sidebar( )->write( 'Streamlit-style pure ABAP web app' ).
    st->sidebar( )->divider( ).
    st->sidebar( )->metric( label = 'App Version' value = 'v1.0.0' ).

    " Main Area
    st->title( 'abaplit Dashboard' ).
    st->write( 'Welcome to the reactive web framework for ABAP!' ).

    st->divider( ).

    " Metrics in Columns
    DATA(cols) = st->columns( 3 ).
    cols->col( 1 )->metric( label = 'Total Clicks' value = |{ mv_counter }| delta = '+1' ).
    cols->col( 2 )->metric( label = 'User Name' value = mv_user_name ).
    cols->col( 3 )->metric( label = 'Status' value = 'Online' delta = '100%' ).

    st->header( 'User Inputs' ).

    st->text_input( label       = 'Enter your name:'
                    value       = client->bind( mv_user_name )
                    placeholder = 'Type your name...' ).

    st->checkbox( label = 'Enable reactive features'
                  value = client->bind( mv_checked ) ).

    st->slider( label = 'Adjust volume/level'
                min   = '0'
                max   = '100'
                value = client->bind( mv_slider ) ).

    st->text_area( label = 'Notes'
                   value = client->bind( mv_text_area ) ).

    st->divider( ).

    " Button & Event Handling
    IF client->check_event( 'BTN_INCREMENT' ).
      mv_counter = mv_counter + 1.
      st->success( |Button clicked! Counter: { mv_counter }| ).
      st->balloons( ).
    ENDIF.

    st->button( text  = 'Click Me to Increment'
                event = client->event( 'BTN_INCREMENT' )
                type  = 'primary' ).

    client->view_display( st->stringify( ) ).
  ENDMETHOD.

ENDCLASS.
