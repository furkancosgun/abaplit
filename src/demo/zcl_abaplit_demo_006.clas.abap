CLASS zcl_abaplit_demo_006 DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES zif_abaplit_app.

    TYPES:
      BEGIN OF ty_product,
        id       TYPE string,
        name     TYPE string,
        category TYPE string,
        stock    TYPE i,
        price    TYPE string,
      END OF ty_product.
    TYPES tt_product TYPE STANDARD TABLE OF ty_product WITH EMPTY KEY.

    DATA mt_products      TYPE tt_product.
    DATA mv_framework     TYPE string VALUE 'React'.
    DATA mv_category      TYPE string VALUE 'Frontend'.
    DATA mv_selected_tags TYPE string VALUE 'ABAP,Streamlit'.
    DATA mv_sentiment     TYPE string VALUE '5'.

    METHODS constructor.

ENDCLASS.


CLASS zcl_abaplit_demo_006 IMPLEMENTATION.

  METHOD constructor.
    APPEND VALUE #( id = 'PRD-01' name = 'HANA Cloud Service'   category = 'Database' stock = 50 price = '$450.00' ) TO mt_products.
    APPEND VALUE #( id = 'PRD-02' name = 'SAP BTP Runtime'      category = 'Cloud'    stock = 12 price = '$1,200.00' ) TO mt_products.
    APPEND VALUE #( id = 'PRD-03' name = 'abaplit Web Engine'   category = 'Frontend' stock = 99 price = '$0.00' ) TO mt_products.
    APPEND VALUE #( id = 'PRD-04' name = 'SICF Express Adapter' category = 'Adapter'  stock = 34 price = '$150.00' ) TO mt_products.
  ENDMETHOD.

  METHOD zif_abaplit_app~main.
    IF client->check_event( 'TRIGGER_TOAST' ).
      client->toast_display( text = 'Action executed successfully from ABAP!' duration = '4000' ).
    ENDIF.
    IF client->check_event( 'COPY_TOKEN' ).
      client->clipboard_write( 'abaplit-token-xyz-123' ).
      client->toast_display( text = 'Token copied to clipboard!' ).
    ENDIF.
    IF client->check_event( 'UPDATE_TITLE' ).
      client->set_title( 'abaplit: Action Triggered Title' ).
      client->toast_display( text = 'Window title changed!' ).
    ENDIF.

    DATA(st) = client->new_view( ).

    " --- Sidebar ---
    DATA(sb) = st->sidebar( ).
    sb->link_button( label = '<- Back to Hub' url = '?app=zcl_abaplit_demo_000' ).
    sb->divider( ).
    sb->title( 'Modern Controls' ).
    sb->badge( text = 'v2.0 Modern' color = '#ff4b4b' ).
    sb->pills( label   = 'Select Tech Stack:'
               options = 'React,Vue,Angular,Svelte'
               value   = client->bind( mv_framework ) ).

    sb->segmented_control( label   = 'Target Tier:'
                           options = 'Frontend,Backend,Fullstack'
                           value   = client->bind( mv_category ) ).

    " --- Main Page ---
    st->title( 'Demo 006: Modern Streamlit Widgets' ).
    st->write( 'Next-generation Streamlit components with dot-notation binding and zero fallback.' ).

    DATA(top_cols) = st->columns( 2 ).
    DATA(c1) = top_cols->col( 1 ).
    DATA(c2) = top_cols->col( 2 ).

    c1->multiselect( label   = 'Filter Tags (MultiSelect):'
                     options = 'ABAP,Streamlit,Cloud,Fiori,NodeJS'
                     value   = client->bind( mv_selected_tags ) ).

    c2->feedback( label   = 'Rate abaplit Experience:'
                  options = 'stars'
                  value   = client->bind( mv_sentiment ) ).

    st->divider( ).

    " --- Popover & Status Container ---
    DATA(pop) = st->popover( label = 'Configure Display Settings' ).
    pop->write( 'Customize interactive data table options.' ).
    pop->checkbox( label = 'Highlight Out of Stock Items' ).
    pop->button( text = 'Apply Settings' ).

    DATA(stat) = st->status( label = 'Data Pipeline Synchronization' state = 'complete' ).
    stat->write( 'Step 1: Extracted records from SAP CDS view I_Product.' ).
    stat->write( 'Step 2: Hydrated ABAP internal table MT_PRODUCTS.' ).
    stat->write( 'Step 3: Rendered to Streamlit reactive dataframe.' ).

    st->divider( ).

    " --- Interactive Dataframe ---
    st->header( 'Interactive Inventory Dataframe' ).
    st->caption( 'Features real-time search filtering, column sort, and row counting:' ).
    st->dataframe( client->bind( mt_products ) ).

    st->divider( ).

    " --- Copyable Code Block ---
    st->header( 'ABAP Implementation Sample' ).
    st->code( val = |" ABAP view declaration for Demo 006\nDATA(st) = client->new_view( ).\nst->pills( label = 'Choose' options = 'A,B,C' value = client->bind( mv_choice ) ).\nst->dataframe( client->bind( mt_products ) ).| ).

    st->divider( ).

    " --- Backend Actions Showcase ---
    st->header( 'Backend Actions (Toast, Clipboard, Title)' ).
    st->caption( 'Demonstrates server-dispatched client events and notifications:' ).
    DATA(action_cols) = st->columns( 3 ).
    action_cols->col( 1 )->button( text = 'Trigger Toast' event = client->event( 'TRIGGER_TOAST' ) ).
    action_cols->col( 2 )->button( text = 'Copy to Clipboard' event = client->event( 'COPY_TOKEN' ) ).
    action_cols->col( 3 )->button( text = 'Change Window Title' event = client->event( 'UPDATE_TITLE' ) ).

    client->view_display( st->stringify( ) ).
  ENDMETHOD.

ENDCLASS.
