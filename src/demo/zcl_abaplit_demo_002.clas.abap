CLASS zcl_abaplit_demo_002 DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES zif_abaplit_app.

    TYPES:
      BEGIN OF ty_submission,
        user_name  TYPE string,
        department TYPE string,
        color      TYPE string,
        rating     TYPE string,
      END OF ty_submission.
    TYPES tt_submission TYPE STANDARD TABLE OF ty_submission WITH EMPTY KEY.

    DATA mv_name        TYPE string VALUE 'SAP Architect'.
    DATA mv_email       TYPE string VALUE 'architect@company.corp'.
    DATA mv_department  TYPE string VALUE 'Core Development'.
    DATA mv_color       TYPE string VALUE '#ff4b4b'.
    DATA mv_rating      TYPE string VALUE '90'.
    DATA mv_fast_mode   TYPE abap_bool VALUE abap_true.
    DATA mv_feedback    TYPE string VALUE 'Pure ABAP Streamlit feels modern and lightning fast.'.
    DATA mt_submissions TYPE tt_submission.

    METHODS constructor.

ENDCLASS.


CLASS zcl_abaplit_demo_002 IMPLEMENTATION.

  METHOD constructor.
    APPEND VALUE #(
        user_name  = 'Lead Developer'
        department = 'Platform Architecture'
        color      = '#ff4b4b'
        rating     = '95' ) TO mt_submissions.
  ENDMETHOD.

  METHOD zif_abaplit_app~main.
    DATA(st) = client->new_view( ).

    " --- Sidebar Navigation ---
    DATA(sb) = st->sidebar( ).
    sb->link_button( label = '<- Back to Dashboard'
                     url   = '?app=zcl_abaplit_demo_000' ).
    sb->divider( ).
    sb->title( 'Form Overview' ).
    sb->write( 'Live state reflected dynamically on roundtrips.' ).
    sb->metric( label = 'Submissions' value = |{ lines( mt_submissions ) }| delta = '+1' ).

    " Handle Form Submission Event
    IF client->check_event( 'SUBMIT_FORM' ).
      APPEND VALUE #(
          user_name  = mv_name
          department = mv_department
          color      = mv_color
          rating     = mv_rating ) TO mt_submissions.
      st->success( |Form submitted for { mv_name }! New entry logged in ABAP table.| ).
      st->balloons( ).
    ENDIF.

    " --- Main Page ---
    st->title( 'Demo 002: Forms & Reactive Controls' ).
    st->write( 'Two-way bound interactive form controls synchronized with ABAP state.' ).

    DATA(cols) = st->columns( 2 ).

    " Column 1: Inputs
    DATA(col1) = cols->col( 1 ).
    col1->subheader( 'Input Fields' ).
    col1->text_input( label       = 'Full Name:'
                      value       = client->bind( mv_name )
                      placeholder = 'Enter full name...' ).

    col1->text_input( label       = 'Corporate Email:'
                      value       = client->bind( mv_email )
                      placeholder = 'user@example.com' ).

    col1->selectbox( label   = 'Department / Area:'
                     options = 'Core Development,Enterprise Cloud,Quality Assurance,Security'
                     value   = client->bind( mv_department ) ).

    col1->toggle( label = 'Enable High-Performance Execution'
                  value = client->bind( mv_fast_mode ) ).

    " Column 2: Advanced Controls
    DATA(col2) = cols->col( 2 ).
    col2->subheader( 'Styling & Ratings' ).
    col2->color_picker( label = 'Accent Brand Color:'
                        value = client->bind( mv_color ) ).

    col2->slider( label = 'Satisfaction Rating (0-100):'
                  min   = '0'
                  max   = '100'
                  value = client->bind( mv_rating ) ).

    col2->text_area( label = 'Feedback & Suggestions:'
                     value = client->bind( mv_feedback ) ).

    st->divider( ).

    st->button( text  = 'Submit Form to ABAP'
                event = 'SUBMIT_FORM'
                type  = 'primary' ).

    st->header( 'Logged Submissions Table' ).
    st->write( 'This table is bound to the internal table MT_SUBMISSIONS:' ).
    st->table( client->bind( mt_submissions ) ).

    client->view_display( st->stringify( ) ).
  ENDMETHOD.

ENDCLASS.
