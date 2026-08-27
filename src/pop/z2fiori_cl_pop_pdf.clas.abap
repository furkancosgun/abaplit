CLASS z2fiori_cl_pop_pdf DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES z2fiori_if_app.

    DATA mv_title    TYPE string.
    DATA mv_filename TYPE string VALUE 'document.pdf'.
    DATA mv_base64   TYPE string.

    CLASS-METHODS factory
      IMPORTING
        title         TYPE clike OPTIONAL
        filename      TYPE clike OPTIONAL
        base64        TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO z2fiori_cl_pop_pdf.

ENDCLASS.


CLASS z2fiori_cl_pop_pdf IMPLEMENTATION.
  METHOD factory.
    result = NEW #( ).
    result->mv_title    = title.
    result->mv_filename = filename.
    result->mv_base64   = base64.
    IF result->mv_title IS INITIAL.
      result->mv_title = 'PDF Document'.
    ENDIF.
    IF result->mv_filename IS INITIAL.
      result->mv_filename = 'document.pdf'.
    ENDIF.
  ENDMETHOD.

  METHOD z2fiori_if_app~main.
    CASE client->get( )-event.
      WHEN 'DOWNLOAD'.
        client->file_download(
          filename = mv_filename
          base64   = mv_base64
          type     = 'application/pdf' ).
        client->toast_display( |Downloading { mv_filename }...| ).

      WHEN 'CLOSE'.
        client->popup_close( ).
        client->nav_leave( ).
        RETURN.
    ENDCASE.

    IF client->check_init( ) = abap_true.
      DATA(view) = z2fiori_cl_xml_view_builder=>factory( ).

      view->dialog( title = mv_title content_width = '500px'
        )->vbox( class = 'sapUiMediumMargin'
          )->text( |File: { mv_filename } (Ready to download)|
        )->end(
      )->buttons(
        )->button( text = 'Download PDF' press = client->event( 'DOWNLOAD' ) type = 'Emphasized' icon = 'sap-icon://download'
        )->button( text = 'Close' press = client->event( 'CLOSE' ) ).

      client->popup_show( view->stringify( ) ).
    ENDIF.
  ENDMETHOD.
ENDCLASS.
