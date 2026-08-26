CLASS z2fiori_cl_smp_006_table DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES z2fiori_if_app.

    TYPES:
      BEGIN OF ty_s_flight,
        carrid   TYPE string,
        connid   TYPE string,
        cityfrom TYPE string,
        cityto   TYPE string,
        price    TYPE string,
        curr     TYPE string,
      END OF ty_s_flight,
      ty_t_flight TYPE STANDARD TABLE OF ty_s_flight WITH EMPTY KEY.

    DATA mt_flights     TYPE ty_t_flight.
    DATA ms_selected    TYPE ty_s_flight.

    DATA mv_status_msg  TYPE string VALUE `Flight list loaded`.

ENDCLASS.

CLASS z2fiori_cl_smp_006_table IMPLEMENTATION.

  METHOD z2fiori_if_app~main.
    DATA lo_view  TYPE REF TO z2fiori_cl_xml_view_builder.
    DATA lo_popup TYPE REF TO z2fiori_cl_xml_view_builder.
    DATA lt_args TYPE string_table.

    IF client->check_init( ).

      mt_flights = VALUE #(
        ( carrid = `LH` connid = `0400` cityfrom = `Frankfurt` cityto = `New York`  price = `750` curr = `EUR` )
        ( carrid = `TK` connid = `1980` cityfrom = `Istanbul`  cityto = `London`    price = `320` curr = `EUR` )
        ( carrid = `AA` connid = `0100` cityfrom = `New York`  cityto = `London`    price = `680` curr = `USD` ) ).


      APPEND |$\{CARRID\}| TO lt_args.
      APPEND |$\{CONNID\}| TO lt_args.
      DATA(lv_row_event) = client->event( event = `ROW_SELECT`
                                          t_arg = lt_args ).

      lo_view = z2fiori_cl_xml_view_builder=>factory( ).
      lo_view->page( id = `pageTable` title = `Sample 006 - Table & Row Action Event`
        )->vbox( class = `sapUiMediumMargin`
          )->text( id = `txtTableStatus` text = client->bind( mv_status_msg )
          )->table( id = `tblFlights` items = client->bind( mt_flights )
            )->columns(
              )->column( )->text( `Airline` )->end(
              )->column( )->text( `Flight No` )->end(
              )->column( )->text( `Departure` )->end(
              )->column( )->text( `Destination` )->end(
              )->column( )->text( `Price` )->end(
              )->column( )->text( `Action` )->end(
            )->end(
            )->items(
              )->column_list_item(
                )->cells(
                  )->text( text = `{CARRID}`
                  )->text( text = `{CONNID}`
                  )->text( text = `{CITYFROM}`
                  )->text( text = `{CITYTO}`
                  )->text( text = `{PRICE} {CURR}`
                  )->button( text = `Details` press = lv_row_event
              )->root( ).

      client->view_display( lo_view->stringify( ) ).

    ELSEIF client->check_event( ).

      CASE client->get_event( ).
        WHEN `ROW_SELECT`.
          DATA(lv_carrid) = client->get_event_arg( 1 ).
          DATA(lv_connid) = client->get_event_arg( 2 ).

          READ TABLE mt_flights INTO ms_selected WITH KEY carrid = lv_carrid connid = lv_connid.
          IF sy-subrc = 0.
            mv_status_msg = |Selected flight: { lv_carrid } { lv_connid }|.

            lo_popup = z2fiori_cl_xml_view_builder=>factory_popup( ).
            lo_popup->dialog( id = `dlgFlightEdit` title = |Edit Flight - { ms_selected-carrid } { ms_selected-connid }|
              )->vbox( class = `sapUiMediumMargin`
                )->label( `Departure City`
                )->input( id = `inpCityFrom` value = client->bind( ms_selected-cityfrom )
                )->label( `Destination City`
                )->input( id = `inpCityTo` value = client->bind( ms_selected-cityto )
                )->label( `Price`
                )->input( id = `inpPrice` value = client->bind( ms_selected-price )
                )->button( id = `btnSaveFlight` text = `Save` press = client->event( `SAVE_FLIGHT` )
                )->button( id = `btnCloseFlight` text = `Cancel` press = client->event( `CLOSE_FLIGHT` ) ).

            client->popup_show( lo_popup->stringify( ) ).
          ENDIF.

        WHEN `SAVE_FLIGHT`.
          ASSIGN mt_flights[ carrid = ms_selected-carrid connid = ms_selected-connid ] TO FIELD-SYMBOL(<fs_flight>).
          IF sy-subrc = 0.
            <fs_flight> = ms_selected.
            mv_status_msg = |Flight updated: { ms_selected-carrid } { ms_selected-connid } -> { ms_selected-price } { ms_selected-curr }|.
            client->toast_display( `Flight updated successfully` ).
          ENDIF.
          client->popup_close( ).

        WHEN `CLOSE_FLIGHT`.
          mv_status_msg = `Flight edit cancelled`.
          client->popup_close( ).

      ENDCASE.

    ENDIF.

  ENDMETHOD.

ENDCLASS.