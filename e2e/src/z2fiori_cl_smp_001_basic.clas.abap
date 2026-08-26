CLASS z2fiori_cl_smp_001_basic DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES z2fiori_if_app.

    DATA mv_user_input TYPE string VALUE `Fiori Developer`.
    DATA mv_counter    TYPE i VALUE 0.

  PROTECTED SECTION.
  PRIVATE SECTION.
ENDCLASS.

CLASS z2fiori_cl_smp_001_basic IMPLEMENTATION.

  METHOD z2fiori_if_app~main.
    DATA lo_view TYPE REF TO z2fiori_cl_view_builder.
    DATA lo_page TYPE REF TO z2fiori_cl_view_builder.
    DATA lo_vbox TYPE REF TO z2fiori_cl_view_builder.

    IF client->check_init( ).
      lo_view = z2fiori_cl_view_builder=>factory(
        )->ele( n = `View` ns = `mvc`
          )->a( n = `displayBlock` v = `true`
          )->a( n = `height`       v = `100%`
          )->a( n = `xmlns`        v = `sap.m`
          )->a( n = `xmlns:mvc`    v = `sap.ui.core.mvc` ).

      lo_page = lo_view->ele( `Page`
        )->a( n = `id`    v = `pageBasic`
        )->a( n = `title` v = `Sample 001 - Basic Binding & Events` ).

      lo_vbox = lo_page->ele( `VBox` )->a( n = `class` v = `sapUiMediumMargin` ).

      lo_vbox->ele( `Text`
        )->a( n = `id`   v = `txtGreeting`
        )->a( n = `text` v = |Hello { client->bind( mv_user_input ) }!| ).

      lo_vbox->ele( `Text`
        )->a( n = `id`   v = `txtCount`
        )->a( n = `text` v = client->bind( mv_counter ) ).

      lo_vbox->ele( `Input`
        )->a( n = `id`    v = `inpName`
        )->a( n = `value` v = client->bind( mv_user_input ) ).

      lo_vbox->ele( `Button`
        )->a( n = `id`    v = `btnCount`
        )->a( n = `text`  v = `Increment Counter`
        )->a( n = `press` v = client->event( `INCREMENT` ) ).

      lo_vbox->ele( `Button`
        )->a( n = `id`    v = `btnToast`
        )->a( n = `text`  v = `Show Toast`
        )->a( n = `press` v = client->event( `SHOW_TOAST` ) ).

      client->view_display( lo_view->stringify( ) ).

    ELSEIF client->check_event( ).

      CASE client->get_event( ).
        WHEN `INCREMENT`.
          mv_counter = mv_counter + 1.
          client->toast_display( |Counter is now { mv_counter }| ).

        WHEN `SHOW_TOAST`.
          client->toast_display( |Welcome { mv_user_input }!| ).
      ENDCASE.

    ENDIF.

  ENDMETHOD.

ENDCLASS.
