CLASS zcl_abaplit_demo_000 DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES zif_abaplit_app.

    TYPES:
      BEGIN OF ty_demo_info,
        app_id      TYPE string,
        title       TYPE string,
        category    TYPE string,
        description TYPE string,
        status      TYPE string,
      END OF ty_demo_info.
    TYPES tt_demo_info TYPE STANDARD TABLE OF ty_demo_info WITH EMPTY KEY.

    DATA mt_demos         TYPE tt_demo_info.
    DATA mv_active_demos  TYPE i VALUE 5.
    DATA mv_framework_ver TYPE string VALUE 'v1.0.0'.
    DATA mv_runtime       TYPE string VALUE 'ABAP Cloud / On-Premise'.

    METHODS constructor.

ENDCLASS.


CLASS zcl_abaplit_demo_000 IMPLEMENTATION.

  METHOD constructor.
    APPEND VALUE #(
        app_id      = 'zcl_abaplit_demo_001'
        title       = 'Charts & Analytics'
        category    = 'Visualizations'
        description = 'Line, Bar, Area, and Scatter charts with dynamic internal table binding'
        status      = 'Ready' ) TO mt_demos.

    APPEND VALUE #(
        app_id      = 'zcl_abaplit_demo_002'
        title       = 'Forms & Reactive Controls'
        category    = 'Interactive'
        description = 'Text inputs, toggle switches, color picker, sliders, and form submission'
        status      = 'Ready' ) TO mt_demos.

    APPEND VALUE #(
        app_id      = 'zcl_abaplit_demo_003'
        title       = 'SAP Business Tables & DataFrames'
        category    = 'Data & Enterprise'
        description = 'Sales orders, Material master, filtering, and export capabilities'
        status      = 'Ready' ) TO mt_demos.

    APPEND VALUE #(
        app_id      = 'zcl_abaplit_demo_004'
        title       = 'Conversational AI & Chat Assistant'
        category    = 'AI / Copilot'
        description = 'Streamlit chat bubbles, real-time message stream, and AI responses'
        status      = 'Ready' ) TO mt_demos.

    APPEND VALUE #(
        app_id      = 'zcl_abaplit_demo_005'
        title       = 'Layouts, Tabs & Modals'
        category    = 'User Experience'
        description = 'Multi-tab container, modal dialogs, and collapsible diagnostics'
        status      = 'Ready' ) TO mt_demos.
  ENDMETHOD.

  METHOD zif_abaplit_app~main.
    DATA(st) = client->new_view( ).

    " --- Sidebar Navigation ---
    DATA(sb) = st->sidebar( ).
    sb->title( 'Demo Navigator' ).
    sb->write( 'Select an abaplit application:' ).

    sb->link_button( label = '001: Charts & Analytics'
                     url   = '?app=zcl_abaplit_demo_001' ).

    sb->link_button( label = '002: Forms & Controls'
                     url   = '?app=zcl_abaplit_demo_002' ).

    sb->link_button( label = '003: Business Tables'
                     url   = '?app=zcl_abaplit_demo_003' ).

    sb->link_button( label = '004: AI Chat Assistant'
                     url   = '?app=zcl_abaplit_demo_004' ).

    sb->link_button( label = '005: Tabs & Layouts'
                     url   = '?app=zcl_abaplit_demo_005' ).

    sb->divider( ).
    sb->metric( label = 'Version' value = mv_framework_ver ).
    sb->metric( label = 'Catalog' value = |{ lines( mt_demos ) } Demos| ).

    " --- Main Dashboard ---
    st->title( 'abaplit Dashboard' ).
    st->write( 'Streamlit reactive web application framework running natively on SAP ABAP.' ).

    " Status Metrics
    DATA(cols) = st->columns( 3 ).
    cols->col( 1 )->metric( label = 'Available Demos' value = |{ mv_active_demos }| delta = '+5' ).
    cols->col( 2 )->metric( label = 'Framework Core' value = mv_framework_ver ).
    cols->col( 3 )->metric( label = 'Architecture' value = 'Reactive' delta = mv_runtime ).

    st->divider( ).
    st->header( 'Featured Application Showcase' ).

    " Launch cards for Demos
    DATA(card_cols) = st->columns( 2 ).

    " Card 1: Charts
    DATA(c1) = card_cols->col( 1 ).
    c1->subheader( 'Demo 001: Charts & Analytics' ).
    c1->caption( 'Visualizations: Line, Bar, Area, and Scatter charts backed by ABAP internal tables.' ).
    c1->link_button( label = 'Launch Demo 001' url = '?app=zcl_abaplit_demo_001' ).

    " Card 2: Forms
    DATA(c2) = card_cols->col( 2 ).
    c2->subheader( 'Demo 002: Forms & Controls' ).
    c2->caption( 'Interactive inputs: Toggle switch, Color picker, Slider, Selectbox, and Submissions.' ).
    c2->link_button( label = 'Launch Demo 002' url = '?app=zcl_abaplit_demo_002' ).

    " Card 3: Business Tables
    DATA(card_cols2) = st->columns( 2 ).
    DATA(c3) = card_cols2->col( 1 ).
    c3->subheader( 'Demo 003: Business DataFrames' ).
    c3->caption( 'Enterprise tables: Sales orders and Inventory with native ABAP internal table binding.' ).
    c3->link_button( label = 'Launch Demo 003' url = '?app=zcl_abaplit_demo_003' ).

    " Card 4: AI Chat
    DATA(c4) = card_cols2->col( 2 ).
    c4->subheader( 'Demo 004: AI Chat Assistant' ).
    c4->caption( 'Conversational UI: Streamlit chat bubbles, user and bot avatars, and prompt handling.' ).
    c4->link_button( label = 'Launch Demo 004' url = '?app=zcl_abaplit_demo_004' ).

    st->divider( ).

    " Interactive Demo Catalog Table
    st->header( 'All Applications Catalog' ).
    st->write( 'The table below is bound directly from an ABAP internal table using client->bind:' ).
    st->table( client->bind( mt_demos ) ).

    client->view_display( st->stringify( ) ).
  ENDMETHOD.

ENDCLASS.
