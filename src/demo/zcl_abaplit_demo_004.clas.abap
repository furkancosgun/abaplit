CLASS zcl_abaplit_demo_004 DEFINITION
  PUBLIC FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES zif_abaplit_app.

    TYPES:
      BEGIN OF ty_chat_item,
        name   TYPE string,
        avatar TYPE string,
        text   TYPE string,
      END OF ty_chat_item.
    TYPES tt_chat_item TYPE STANDARD TABLE OF ty_chat_item WITH EMPTY KEY.

    DATA mt_chat_history TYPE tt_chat_item.
    DATA mv_model_name   TYPE string VALUE 'SAP Joule / AI Assistant'.
    DATA mv_temp         TYPE string VALUE '0.7'.

    METHODS constructor.

ENDCLASS.


CLASS zcl_abaplit_demo_004 IMPLEMENTATION.

  METHOD constructor.
    APPEND VALUE #(
        name   = 'assistant'
        avatar = 'AB'
        text   = 'Hello! I am your abaplit enterprise AI copilot. How can I help you today?' )
      TO mt_chat_history.

    APPEND VALUE #(
        name   = 'user'
        avatar = 'DV'
        text   = 'Can I build reactive dashboards in SAP without external Node servers?' )
      TO mt_chat_history.

    APPEND VALUE #(
        name   = 'assistant'
        avatar = 'AB'
        text   = 'Yes! abaplit embeds the entire Streamlit web bundle into a single ABAP class served via SICF.' )
      TO mt_chat_history.
  ENDMETHOD.

  METHOD zif_abaplit_app~main.
    DATA(st) = client->new_view( ).

    " --- Sidebar Navigation ---
    DATA(sb) = st->sidebar( ).
    sb->link_button( label = '<- Back to Dashboard'
                     url   = '?app=zcl_abaplit_demo_000' ).
    sb->divider( ).
    sb->title( 'Model Parameters' ).
    sb->text_input( label = 'Active LLM Engine:'
                    value = client->bind( mv_model_name ) ).
    sb->slider( label = 'Temperature:'
                min   = '0'
                max   = '1'
                value = client->bind( mv_temp ) ).
    sb->divider( ).
    sb->metric( label = 'Conversation Length'
                value = |{ lines( mt_chat_history ) } Messages|
                delta = '+1' ).
    sb->button( text  = 'Clear History'
                event = 'CLEAR_CHAT' ).

    " Handle Clear History
    IF client->check_event( 'CLEAR_CHAT' ).
      CLEAR mt_chat_history.
      APPEND VALUE #(
          name   = 'assistant'
          avatar = 'AB'
          text   = 'Conversation reset. How can I assist you?' ) TO mt_chat_history.
      st->info( 'Chat history cleared.' ).
    ENDIF.

    " Handle New Message Event
    IF client->check_event( 'CHAT_SEND' ).
      APPEND VALUE #(
          name   = 'user'
          avatar = 'DV'
          text   = 'What are the performance characteristics of abaplit?' ) TO mt_chat_history.
      APPEND VALUE #(
          name   = 'assistant'
          avatar = 'AB'
          text   = 'abaplit uses diff-based reactive state and native AJSON serialization for sub-millisecond roundtrips.' )
        TO mt_chat_history.
      st->balloons( ).
    ENDIF.

    " --- Main Page ---
    st->title( 'Demo 004: Conversational AI & Chat' ).
    st->write( 'Streamlit chat message interface running directly on SAP ABAP.' ).

    st->divider( ).

    " Render Conversation dynamically from internal table
    LOOP AT mt_chat_history ASSIGNING FIELD-SYMBOL(<ls_msg>).
      DATA(lo_msg) = st->chat_message( name   = <ls_msg>-name
                                       avatar = <ls_msg>-avatar ).
      lo_msg->write( <ls_msg>-text ).
    ENDLOOP.

    st->chat_input( placeholder = 'Ask the ABAP assistant anything...'
                    event       = 'CHAT_SEND' ).

    st->divider( ).
    DATA(exp) = st->expander( 'Chat Session Table (Internal Table)' ).
    exp->write( 'Underlying internal table MT_CHAT_HISTORY bound via client->bind:' ).
    exp->table( client->bind( mt_chat_history ) ).

    client->view_display( st->stringify( ) ).
  ENDMETHOD.

ENDCLASS.
