CLASS zcl_abaplit_view_builder DEFINITION
  PUBLIC
  CREATE PUBLIC.

  PUBLIC SECTION.
    CLASS-METHODS factory
      IMPORTING
        type          TYPE string OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS root
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS container
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS sidebar
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS expander
      IMPORTING
        label         TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS columns
      IMPORTING
        count         TYPE i DEFAULT 2
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS col
      IMPORTING
        index         TYPE i
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS tabs
      IMPORTING
        count         TYPE i DEFAULT 2
        titles        TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS tab
      IMPORTING
        index         TYPE i
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS dialog
      IMPORTING
        title         TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS status
      IMPORTING
        label         TYPE clike
        state         TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS popover
      IMPORTING
        label         TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    " --- Chat & AI Assistant ---
    METHODS chat_message
      IMPORTING
        name          TYPE clike
        avatar        TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS chat_input
      IMPORTING
        placeholder   TYPE clike OPTIONAL
        value         TYPE clike OPTIONAL
        on_change     TYPE clike OPTIONAL
        on_submit     TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    " --- Text & Typography ---
    METHODS title
      IMPORTING
        value         TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS header
      IMPORTING
        value         TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS subheader
      IMPORTING
        value         TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS write
      IMPORTING
        value         TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS text
      IMPORTING
        value         TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS markdown
      IMPORTING
        value         TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS caption
      IMPORTING
        value         TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS code
      IMPORTING
        value         TYPE clike
        language      TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS divider
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    " --- Input Widgets ---
    METHODS button
      IMPORTING
        text          TYPE clike
        on_click      TYPE clike OPTIONAL
        type          TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS link_button
      IMPORTING
        label         TYPE clike
        url           TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS download_button
      IMPORTING
        label         TYPE clike
        data          TYPE clike
        file_name     TYPE clike
        mime          TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS text_input
      IMPORTING
        label         TYPE clike
        value         TYPE clike OPTIONAL
        placeholder   TYPE clike OPTIONAL
        on_change     TYPE clike OPTIONAL
        on_submit     TYPE clike OPTIONAL
        type          TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS number_input
      IMPORTING
        label         TYPE clike
        value         TYPE clike OPTIONAL
        min           TYPE clike OPTIONAL
        max           TYPE clike OPTIONAL
        step          TYPE clike OPTIONAL
        on_change     TYPE clike OPTIONAL
        on_submit     TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS text_area
      IMPORTING
        label         TYPE clike
        value         TYPE clike OPTIONAL
        placeholder   TYPE clike OPTIONAL
        height        TYPE clike OPTIONAL
        on_change     TYPE clike OPTIONAL
        on_submit     TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS checkbox
      IMPORTING
        label         TYPE clike
        value         TYPE clike OPTIONAL
        on_change     TYPE clike OPTIONAL
        on_submit     TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS toggle
      IMPORTING
        label         TYPE clike
        value         TYPE clike OPTIONAL
        on_change     TYPE clike OPTIONAL
        on_submit     TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS color_picker
      IMPORTING
        label         TYPE clike
        value         TYPE clike OPTIONAL
        on_change     TYPE clike OPTIONAL
        on_submit     TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS file_uploader
      IMPORTING
        label         TYPE clike
        accept        TYPE clike OPTIONAL
        on_change     TYPE clike OPTIONAL
        on_submit     TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS radio
      IMPORTING
        label         TYPE clike
        options       TYPE clike OPTIONAL
        value         TYPE clike OPTIONAL
        on_change     TYPE clike OPTIONAL
        on_submit     TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS selectbox
      IMPORTING
        label         TYPE clike
        options       TYPE clike OPTIONAL
        value         TYPE clike OPTIONAL
        on_change     TYPE clike OPTIONAL
        on_submit     TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS multiselect
      IMPORTING
        label         TYPE clike
        options       TYPE clike OPTIONAL
        value         TYPE clike OPTIONAL
        on_change     TYPE clike OPTIONAL
        on_submit     TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS pills
      IMPORTING
        label         TYPE clike
        options       TYPE clike OPTIONAL
        value         TYPE clike OPTIONAL
        on_change     TYPE clike OPTIONAL
        on_submit     TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS segmented_control
      IMPORTING
        label         TYPE clike
        options       TYPE clike OPTIONAL
        value         TYPE clike OPTIONAL
        on_change     TYPE clike OPTIONAL
        on_submit     TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS feedback
      IMPORTING
        label         TYPE clike OPTIONAL
        options       TYPE clike OPTIONAL
        value         TYPE clike OPTIONAL
        on_change     TYPE clike OPTIONAL
        on_submit     TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS slider
      IMPORTING
        label         TYPE clike
        min           TYPE clike OPTIONAL
        max           TYPE clike OPTIONAL
        value         TYPE clike OPTIONAL
        on_change     TYPE clike OPTIONAL
        on_submit     TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS date_input
      IMPORTING
        label         TYPE clike
        value         TYPE clike OPTIONAL
        on_change     TYPE clike OPTIONAL
        on_submit     TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS time_input
      IMPORTING
        label         TYPE clike
        value         TYPE clike OPTIONAL
        on_change     TYPE clike OPTIONAL
        on_submit     TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS select_slider
      IMPORTING
        label         TYPE clike
        options       TYPE clike OPTIONAL
        value         TYPE clike OPTIONAL
        on_change     TYPE clike OPTIONAL
        on_submit     TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS datetime_input
      IMPORTING
        label         TYPE clike
        value         TYPE clike OPTIONAL
        on_change     TYPE clike OPTIONAL
        on_submit     TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS form
      IMPORTING
        key           TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS form_submit_button
      IMPORTING
        label         TYPE clike
        on_click      TYPE clike OPTIONAL
        type          TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS page_link
      IMPORTING
        label         TYPE clike
        page          TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS empty
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS latex
      IMPORTING
        body          TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS html
      IMPORTING
        body          TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS exception
      IMPORTING
        value         TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    " --- Charts & Visualizations ---
    METHODS line_chart
      IMPORTING
        data          TYPE clike
        height        TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS bar_chart
      IMPORTING
        data          TYPE clike
        height        TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS area_chart
      IMPORTING
        data          TYPE clike
        height        TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS scatter_chart
      IMPORTING
        data          TYPE clike
        height        TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    " --- Data & Media Display ---
    METHODS metric
      IMPORTING
        label         TYPE clike
        value         TYPE clike
        delta         TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS table
      IMPORTING
        data          TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS dataframe
      IMPORTING
        data          TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS json
      IMPORTING
        data          TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS badge
      IMPORTING
        text          TYPE clike
        color         TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS image
      IMPORTING
        src           TYPE clike
        caption       TYPE clike OPTIONAL
        width         TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS audio
      IMPORTING
        src           TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS video
      IMPORTING
        src           TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    " --- Feedback & Alerts ---
    METHODS success
      IMPORTING
        value         TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS info
      IMPORTING
        value         TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS warning
      IMPORTING
        value         TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS error
      IMPORTING
        value         TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS toast
      IMPORTING
        value         TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS progress
      IMPORTING
        value         TYPE clike
        text          TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS spinner
      IMPORTING
        value         TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS balloons
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS snow
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    " --- Output ---
    METHODS stringify
      RETURNING
        VALUE(result) TYPE string.

  PROTECTED SECTION.
    TYPES ty_t_node TYPE STANDARD TABLE OF REF TO zcl_abaplit_view_builder WITH EMPTY KEY.

    TYPES:
      BEGIN OF ty_s_prop,
        name  TYPE string,
        value TYPE string,
      END OF ty_s_prop,
      ty_t_prop TYPE STANDARD TABLE OF ty_s_prop WITH EMPTY KEY.

    DATA mv_type   TYPE string.
    DATA mt_props  TYPE ty_t_prop.
    DATA mt_child  TYPE ty_t_node.
    DATA mo_parent TYPE REF TO zcl_abaplit_view_builder.
    DATA mo_root   TYPE REF TO zcl_abaplit_view_builder.

    METHODS render
      RETURNING
        VALUE(result) TYPE string.

    METHODS json_escape
      IMPORTING
        val           TYPE string
      RETURNING
        VALUE(result) TYPE string.

    METHODS ele
      IMPORTING
        type          TYPE string
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.



    METHODS prop
      IMPORTING
        name          TYPE string
        value         TYPE string
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS end
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

ENDCLASS.


CLASS zcl_abaplit_view_builder IMPLEMENTATION.



  METHOD factory.
    result = NEW #( ).
    result->mo_root = result.
    IF type IS NOT INITIAL.
      result->mv_type = type.
    ELSE.
      result->mv_type = 'root'.
    ENDIF.
  ENDMETHOD.

  METHOD ele.
    result = NEW #( ).
    result->mo_root   = mo_root.
    result->mo_parent = me.
    result->mv_type   = type.
    APPEND result TO mt_child.
  ENDMETHOD.

  METHOD prop.
    APPEND VALUE #( name  = name
                    value = value ) TO mt_props.
    result = me.
  ENDMETHOD.

  METHOD end.
    IF mo_parent IS NOT BOUND.
      result = me.
      RETURN.
    ENDIF.
    result = mo_parent.
  ENDMETHOD.

  METHOD root.
    result = mo_root.
  ENDMETHOD.

  METHOD container.
    result = ele( 'container' ).
  ENDMETHOD.

  METHOD sidebar.
    LOOP AT mo_root->mt_child ASSIGNING FIELD-SYMBOL(<lo_child>).
      IF <lo_child>->mv_type = 'sidebar'.
        result = <lo_child>.
        RETURN.
      ENDIF.
    ENDLOOP.
    result = mo_root->ele( 'sidebar' ).
  ENDMETHOD.

  METHOD expander.
    result = ele( 'expander' ).
    result->prop( name = 'label' value = |{ label }| ).
  ENDMETHOD.

  METHOD columns.
    result = ele( 'columns' ).
    result->prop( name = 'count' value = |{ count }| ).
    DATA(lv_i) = 1.
    WHILE lv_i <= count.
      result->ele( 'column' )->prop( name = 'index' value = |{ lv_i }| )->end( ).
      lv_i = lv_i + 1.
    ENDWHILE.
  ENDMETHOD.

  METHOD col.
    IF lines( mt_child ) >= index AND index > 0.
      result = mt_child[ index ].
    ELSE.
      result = me.
    ENDIF.
  ENDMETHOD.

  METHOD tabs.
    result = ele( 'tabs' ).
    result->prop( name = 'count' value = |{ count }| ).
    IF titles IS SUPPLIED.
      result->prop( name = 'titles' value = |{ titles }| ).
    ENDIF.
    DATA(lv_i) = 1.
    WHILE lv_i <= count.
      result->ele( 'tab' )->prop( name = 'index' value = |{ lv_i }| )->end( ).
      lv_i = lv_i + 1.
    ENDWHILE.
  ENDMETHOD.

  METHOD tab.
    IF lines( mt_child ) >= index AND index > 0.
      result = mt_child[ index ].
    ELSE.
      result = me.
    ENDIF.
  ENDMETHOD.

  METHOD dialog.
    result = ele( 'dialog' ).
    result->prop( name = 'title' value = |{ title }| ).
  ENDMETHOD.

  METHOD status.
    result = ele( 'status' ).
    result->prop( name = 'label' value = |{ label }| ).
    IF state IS SUPPLIED.
      result->prop( name = 'state' value = |{ state }| ).
    ENDIF.
  ENDMETHOD.

  METHOD popover.
    result = ele( 'popover' ).
    result->prop( name = 'label' value = |{ label }| ).
  ENDMETHOD.

  METHOD chat_message.
    result = ele( 'chat_message' ).
    result->prop( name = 'name' value = |{ name }| ).
    IF avatar IS SUPPLIED.
      result->prop( name = 'avatar' value = |{ avatar }| ).
    ENDIF.
  ENDMETHOD.

  METHOD chat_input.
    DATA(lo_chat) = ele( 'chat_input' ).
    IF placeholder IS SUPPLIED.
      lo_chat->prop( name = 'placeholder' value = |{ placeholder }| ).
    ENDIF.
    IF value IS SUPPLIED.
      lo_chat->prop( name = 'value' value = |{ value }| ).
    ENDIF.
    IF on_change IS SUPPLIED AND on_change IS NOT INITIAL.
      lo_chat->prop( name = 'on_change' value = |{ on_change }| ).
    ENDIF.
    IF on_submit IS SUPPLIED.
      lo_chat->prop( name = 'on_submit' value = |{ on_submit }| ).
    ENDIF.
    lo_chat->end( ).
    result = me.
  ENDMETHOD.

  METHOD title.
    ele( 'title' )->prop( name = 'text' value = |{ value }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD header.
    ele( 'header' )->prop( name = 'text' value = |{ value }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD subheader.
    ele( 'subheader' )->prop( name = 'text' value = |{ value }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD write.
    ele( 'write' )->prop( name = 'text' value = |{ value }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD text.
    ele( 'text' )->prop( name = 'text' value = |{ value }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD markdown.
    ele( 'markdown' )->prop( name = 'body' value = |{ value }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD caption.
    ele( 'caption' )->prop( name = 'text' value = |{ value }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD code.
    DATA(lo_code) = ele( 'code' )->prop( name = 'code' value = |{ value }| ).
    IF language IS SUPPLIED AND language IS NOT INITIAL.
      lo_code->prop( name = 'language' value = |{ language }| ).
    ENDIF.
    lo_code->end( ).
    result = me.
  ENDMETHOD.

  METHOD divider.
    ele( 'divider' )->end( ).
    result = me.
  ENDMETHOD.

  METHOD button.
    DATA(lo_btn) = ele( 'button' )->prop( name = 'text' value = |{ text }| ).
    IF on_click IS SUPPLIED AND on_click IS NOT INITIAL.
      lo_btn->prop( name = 'on_click' value = |{ on_click }| ).
    ENDIF.
    IF type IS SUPPLIED AND type IS NOT INITIAL.
      lo_btn->prop( name = 'btn_type' value = |{ type }| ).
    ENDIF.
    lo_btn->end( ).
    result = me.
  ENDMETHOD.

  METHOD link_button.
    ele( 'link_button' )->prop( name = 'label' value = |{ label }| )->prop( name = 'url' value = |{ url }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD download_button.
    DATA(lo_dl) = ele( 'download_button' )->prop( name = 'label' value = |{ label }| )->prop( name = 'data' value = |{ data }| )->prop( name = 'file_name' value = |{ file_name }| ).
    IF mime IS SUPPLIED.
      lo_dl->prop( name = 'mime' value = |{ mime }| ).
    ENDIF.
    lo_dl->end( ).
    result = me.
  ENDMETHOD.

  METHOD text_input.
    DATA(lo_inp) = ele( 'text_input' )->prop( name = 'label' value = |{ label }| ).
    IF value IS SUPPLIED.
      lo_inp->prop( name = 'value' value = |{ value }| ).
    ENDIF.
    IF placeholder IS SUPPLIED AND placeholder IS NOT INITIAL.
      lo_inp->prop( name = 'placeholder' value = |{ placeholder }| ).
    ENDIF.
    IF on_change IS SUPPLIED AND on_change IS NOT INITIAL.
      lo_inp->prop( name = 'on_change' value = |{ on_change }| ).
    ENDIF.
    IF on_submit IS SUPPLIED AND on_submit IS NOT INITIAL.
      lo_inp->prop( name = 'on_submit' value = |{ on_submit }| ).
    ENDIF.
    IF type IS SUPPLIED AND type IS NOT INITIAL.
      lo_inp->prop( name = 'input_type' value = |{ type }| ).
    ENDIF.
    lo_inp->end( ).
    result = me.
  ENDMETHOD.

  METHOD number_input.
    DATA(lo_inp) = ele( 'number_input' )->prop( name = 'label' value = |{ label }| ).
    IF value IS SUPPLIED.
      lo_inp->prop( name = 'value' value = |{ value }| ).
    ENDIF.
    IF min IS SUPPLIED AND min IS NOT INITIAL.
      lo_inp->prop( name = 'min' value = |{ min }| ).
    ENDIF.
    IF max IS SUPPLIED AND max IS NOT INITIAL.
      lo_inp->prop( name = 'max' value = |{ max }| ).
    ENDIF.
    IF step IS SUPPLIED AND step IS NOT INITIAL.
      lo_inp->prop( name = 'step' value = |{ step }| ).
    ENDIF.
    IF on_change IS SUPPLIED AND on_change IS NOT INITIAL.
      lo_inp->prop( name = 'on_change' value = |{ on_change }| ).
    ENDIF.
    IF on_submit IS SUPPLIED AND on_submit IS NOT INITIAL.
      lo_inp->prop( name = 'on_submit' value = |{ on_submit }| ).
    ENDIF.
    lo_inp->end( ).
    result = me.
  ENDMETHOD.

  METHOD text_area.
    DATA(lo_inp) = ele( 'text_area' )->prop( name = 'label' value = |{ label }| ).
    IF value IS SUPPLIED.
      lo_inp->prop( name = 'value' value = |{ value }| ).
    ENDIF.
    IF placeholder IS SUPPLIED AND placeholder IS NOT INITIAL.
      lo_inp->prop( name = 'placeholder' value = |{ placeholder }| ).
    ENDIF.
    IF height IS SUPPLIED AND height IS NOT INITIAL.
      lo_inp->prop( name = 'height' value = |{ height }| ).
    ENDIF.
    IF on_change IS SUPPLIED AND on_change IS NOT INITIAL.
      lo_inp->prop( name = 'on_change' value = |{ on_change }| ).
    ENDIF.
    IF on_submit IS SUPPLIED AND on_submit IS NOT INITIAL.
      lo_inp->prop( name = 'on_submit' value = |{ on_submit }| ).
    ENDIF.
    lo_inp->end( ).
    result = me.
  ENDMETHOD.

  METHOD checkbox.
    DATA(lo_inp) = ele( 'checkbox' )->prop( name = 'label' value = |{ label }| ).
    IF value IS SUPPLIED.
      lo_inp->prop( name = 'value' value = |{ value }| ).
    ENDIF.
    IF on_change IS SUPPLIED AND on_change IS NOT INITIAL.
      lo_inp->prop( name = 'on_change' value = |{ on_change }| ).
    ENDIF.
    IF on_submit IS SUPPLIED AND on_submit IS NOT INITIAL.
      lo_inp->prop( name = 'on_submit' value = |{ on_submit }| ).
    ENDIF.
    lo_inp->end( ).
    result = me.
  ENDMETHOD.

  METHOD toggle.
    DATA(lo_inp) = ele( 'toggle' )->prop( name = 'label' value = |{ label }| ).
    IF value IS SUPPLIED.
      lo_inp->prop( name = 'value' value = |{ value }| ).
    ENDIF.
    IF on_change IS SUPPLIED AND on_change IS NOT INITIAL.
      lo_inp->prop( name = 'on_change' value = |{ on_change }| ).
    ENDIF.
    IF on_submit IS SUPPLIED AND on_submit IS NOT INITIAL.
      lo_inp->prop( name = 'on_submit' value = |{ on_submit }| ).
    ENDIF.
    lo_inp->end( ).
    result = me.
  ENDMETHOD.

  METHOD color_picker.
    DATA(lo_inp) = ele( 'color_picker' )->prop( name = 'label' value = |{ label }| ).
    IF value IS SUPPLIED.
      lo_inp->prop( name = 'value' value = |{ value }| ).
    ENDIF.
    IF on_change IS SUPPLIED AND on_change IS NOT INITIAL.
      lo_inp->prop( name = 'on_change' value = |{ on_change }| ).
    ENDIF.
    IF on_submit IS SUPPLIED AND on_submit IS NOT INITIAL.
      lo_inp->prop( name = 'on_submit' value = |{ on_submit }| ).
    ENDIF.
    lo_inp->end( ).
    result = me.
  ENDMETHOD.

  METHOD file_uploader.
    DATA(lo_inp) = ele( 'file_uploader' )->prop( name = 'label' value = |{ label }| ).
    IF accept IS SUPPLIED.
      lo_inp->prop( name = 'accept' value = |{ accept }| ).
    ENDIF.
    IF on_change IS SUPPLIED AND on_change IS NOT INITIAL.
      lo_inp->prop( name = 'on_change' value = |{ on_change }| ).
    ENDIF.
    IF on_submit IS SUPPLIED AND on_submit IS NOT INITIAL.
      lo_inp->prop( name = 'on_submit' value = |{ on_submit }| ).
    ENDIF.
    lo_inp->end( ).
    result = me.
  ENDMETHOD.

  METHOD radio.
    DATA(lo_inp) = ele( 'radio' )->prop( name = 'label' value = |{ label }| ).
    IF options IS SUPPLIED.
      lo_inp->prop( name = 'options' value = |{ options }| ).
    ENDIF.
    IF value IS SUPPLIED.
      lo_inp->prop( name = 'value' value = |{ value }| ).
    ENDIF.
    IF on_change IS SUPPLIED AND on_change IS NOT INITIAL.
      lo_inp->prop( name = 'on_change' value = |{ on_change }| ).
    ENDIF.
    IF on_submit IS SUPPLIED AND on_submit IS NOT INITIAL.
      lo_inp->prop( name = 'on_submit' value = |{ on_submit }| ).
    ENDIF.
    lo_inp->end( ).
    result = me.
  ENDMETHOD.

  METHOD selectbox.
    DATA(lo_inp) = ele( 'selectbox' )->prop( name = 'label' value = |{ label }| ).
    IF options IS SUPPLIED.
      lo_inp->prop( name = 'options' value = |{ options }| ).
    ENDIF.
    IF value IS SUPPLIED.
      lo_inp->prop( name = 'value' value = |{ value }| ).
    ENDIF.
    IF on_change IS SUPPLIED AND on_change IS NOT INITIAL.
      lo_inp->prop( name = 'on_change' value = |{ on_change }| ).
    ENDIF.
    IF on_submit IS SUPPLIED AND on_submit IS NOT INITIAL.
      lo_inp->prop( name = 'on_submit' value = |{ on_submit }| ).
    ENDIF.
    lo_inp->end( ).
    result = me.
  ENDMETHOD.

  METHOD multiselect.
    DATA(lo_inp) = ele( 'multiselect' )->prop( name = 'label' value = |{ label }| ).
    IF options IS SUPPLIED.
      lo_inp->prop( name = 'options' value = |{ options }| ).
    ENDIF.
    IF value IS SUPPLIED.
      lo_inp->prop( name = 'value' value = |{ value }| ).
    ENDIF.
    IF on_change IS SUPPLIED AND on_change IS NOT INITIAL.
      lo_inp->prop( name = 'on_change' value = |{ on_change }| ).
    ENDIF.
    IF on_submit IS SUPPLIED AND on_submit IS NOT INITIAL.
      lo_inp->prop( name = 'on_submit' value = |{ on_submit }| ).
    ENDIF.
    lo_inp->end( ).
    result = me.
  ENDMETHOD.

  METHOD pills.
    DATA(lo_inp) = ele( 'pills' )->prop( name = 'label' value = |{ label }| ).
    IF options IS SUPPLIED.
      lo_inp->prop( name = 'options' value = |{ options }| ).
    ENDIF.
    IF value IS SUPPLIED.
      lo_inp->prop( name = 'value' value = |{ value }| ).
    ENDIF.
    IF on_change IS SUPPLIED AND on_change IS NOT INITIAL.
      lo_inp->prop( name = 'on_change' value = |{ on_change }| ).
    ENDIF.
    IF on_submit IS SUPPLIED AND on_submit IS NOT INITIAL.
      lo_inp->prop( name = 'on_submit' value = |{ on_submit }| ).
    ENDIF.
    lo_inp->end( ).
    result = me.
  ENDMETHOD.

  METHOD segmented_control.
    DATA(lo_inp) = ele( 'segmented_control' )->prop( name = 'label' value = |{ label }| ).
    IF options IS SUPPLIED.
      lo_inp->prop( name = 'options' value = |{ options }| ).
    ENDIF.
    IF value IS SUPPLIED.
      lo_inp->prop( name = 'value' value = |{ value }| ).
    ENDIF.
    IF on_change IS SUPPLIED AND on_change IS NOT INITIAL.
      lo_inp->prop( name = 'on_change' value = |{ on_change }| ).
    ENDIF.
    IF on_submit IS SUPPLIED AND on_submit IS NOT INITIAL.
      lo_inp->prop( name = 'on_submit' value = |{ on_submit }| ).
    ENDIF.
    lo_inp->end( ).
    result = me.
  ENDMETHOD.

  METHOD feedback.
    DATA(lo_inp) = ele( 'feedback' ).
    IF label IS SUPPLIED.
      lo_inp->prop( name = 'label' value = |{ label }| ).
    ENDIF.
    IF options IS SUPPLIED.
      lo_inp->prop( name = 'options' value = |{ options }| ).
    ENDIF.
    IF value IS SUPPLIED.
      lo_inp->prop( name = 'value' value = |{ value }| ).
    ENDIF.
    IF on_change IS SUPPLIED AND on_change IS NOT INITIAL.
      lo_inp->prop( name = 'on_change' value = |{ on_change }| ).
    ENDIF.
    IF on_submit IS SUPPLIED AND on_submit IS NOT INITIAL.
      lo_inp->prop( name = 'on_submit' value = |{ on_submit }| ).
    ENDIF.
    lo_inp->end( ).
    result = me.
  ENDMETHOD.

  METHOD slider.
    DATA(lo_inp) = ele( 'slider' )->prop( name = 'label' value = |{ label }| ).
    IF min IS SUPPLIED AND min IS NOT INITIAL.
      lo_inp->prop( name = 'min' value = |{ min }| ).
    ENDIF.
    IF max IS SUPPLIED AND max IS NOT INITIAL.
      lo_inp->prop( name = 'max' value = |{ max }| ).
    ENDIF.
    IF value IS SUPPLIED.
      lo_inp->prop( name = 'value' value = |{ value }| ).
    ENDIF.
    IF on_change IS SUPPLIED AND on_change IS NOT INITIAL.
      lo_inp->prop( name = 'on_change' value = |{ on_change }| ).
    ENDIF.
    IF on_submit IS SUPPLIED AND on_submit IS NOT INITIAL.
      lo_inp->prop( name = 'on_submit' value = |{ on_submit }| ).
    ENDIF.
    lo_inp->end( ).
    result = me.
  ENDMETHOD.

  METHOD date_input.
    DATA(lo_inp) = ele( 'date_input' )->prop( name = 'label' value = |{ label }| ).
    IF value IS SUPPLIED.
      lo_inp->prop( name = 'value' value = |{ value }| ).
    ENDIF.
    IF on_change IS SUPPLIED AND on_change IS NOT INITIAL.
      lo_inp->prop( name = 'on_change' value = |{ on_change }| ).
    ENDIF.
    IF on_submit IS SUPPLIED AND on_submit IS NOT INITIAL.
      lo_inp->prop( name = 'on_submit' value = |{ on_submit }| ).
    ENDIF.
    lo_inp->end( ).
    result = me.
  ENDMETHOD.

  METHOD time_input.
    DATA(lo_inp) = ele( 'time_input' )->prop( name = 'label' value = |{ label }| ).
    IF value IS SUPPLIED.
      lo_inp->prop( name = 'value' value = |{ value }| ).
    ENDIF.
    IF on_change IS SUPPLIED AND on_change IS NOT INITIAL.
      lo_inp->prop( name = 'on_change' value = |{ on_change }| ).
    ENDIF.
    IF on_submit IS SUPPLIED AND on_submit IS NOT INITIAL.
      lo_inp->prop( name = 'on_submit' value = |{ on_submit }| ).
    ENDIF.
    lo_inp->end( ).
    result = me.
  ENDMETHOD.

  METHOD select_slider.
    DATA(lo_inp) = ele( 'select_slider' )->prop( name = 'label' value = |{ label }| ).
    IF options IS SUPPLIED.
      lo_inp->prop( name = 'options' value = |{ options }| ).
    ENDIF.
    IF value IS SUPPLIED.
      lo_inp->prop( name = 'value' value = |{ value }| ).
    ENDIF.
    IF on_change IS SUPPLIED AND on_change IS NOT INITIAL.
      lo_inp->prop( name = 'on_change' value = |{ on_change }| ).
    ENDIF.
    IF on_submit IS SUPPLIED AND on_submit IS NOT INITIAL.
      lo_inp->prop( name = 'on_submit' value = |{ on_submit }| ).
    ENDIF.
    lo_inp->end( ).
    result = me.
  ENDMETHOD.

  METHOD datetime_input.
    DATA(lo_inp) = ele( 'datetime_input' )->prop( name = 'label' value = |{ label }| ).
    IF value IS SUPPLIED.
      lo_inp->prop( name = 'value' value = |{ value }| ).
    ENDIF.
    IF on_change IS SUPPLIED AND on_change IS NOT INITIAL.
      lo_inp->prop( name = 'on_change' value = |{ on_change }| ).
    ENDIF.
    IF on_submit IS SUPPLIED AND on_submit IS NOT INITIAL.
      lo_inp->prop( name = 'on_submit' value = |{ on_submit }| ).
    ENDIF.
    lo_inp->end( ).
    result = me.
  ENDMETHOD.

  METHOD form.
    result = ele( 'form' ).
    IF key IS SUPPLIED.
      result->prop( name = 'key' value = |{ key }| ).
    ENDIF.
  ENDMETHOD.

  METHOD form_submit_button.
    DATA(lo_btn) = ele( 'form_submit_button' )->prop( name = 'label' value = |{ label }| ).
    IF on_click IS SUPPLIED AND on_click IS NOT INITIAL.
      lo_btn->prop( name = 'on_click' value = |{ on_click }| ).
    ENDIF.
    IF type IS SUPPLIED AND type IS NOT INITIAL.
      lo_btn->prop( name = 'btn_type' value = |{ type }| ).
    ENDIF.
    lo_btn->end( ).
    result = me.
  ENDMETHOD.

  METHOD page_link.
    ele( 'page_link' )->prop( name = 'label' value = |{ label }| )->prop( name = 'page' value = |{ page }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD empty.
    ele( 'empty' )->end( ).
    result = me.
  ENDMETHOD.

  METHOD latex.
    ele( 'latex' )->prop( name = 'body' value = |{ body }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD html.
    ele( 'html' )->prop( name = 'body' value = |{ body }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD exception.
    ele( 'exception' )->prop( name = 'text' value = |{ value }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD line_chart.
    DATA(lo_c) = ele( 'line_chart' )->prop( name = 'data' value = |{ data }| ).
    IF height IS SUPPLIED.
      lo_c->prop( name = 'height' value = |{ height }| ).
    ENDIF.
    lo_c->end( ).
    result = me.
  ENDMETHOD.

  METHOD bar_chart.
    DATA(lo_c) = ele( 'bar_chart' )->prop( name = 'data' value = |{ data }| ).
    IF height IS SUPPLIED.
      lo_c->prop( name = 'height' value = |{ height }| ).
    ENDIF.
    lo_c->end( ).
    result = me.
  ENDMETHOD.

  METHOD area_chart.
    DATA(lo_c) = ele( 'area_chart' )->prop( name = 'data' value = |{ data }| ).
    IF height IS SUPPLIED.
      lo_c->prop( name = 'height' value = |{ height }| ).
    ENDIF.
    lo_c->end( ).
    result = me.
  ENDMETHOD.

  METHOD scatter_chart.
    DATA(lo_c) = ele( 'scatter_chart' )->prop( name = 'data' value = |{ data }| ).
    IF height IS SUPPLIED.
      lo_c->prop( name = 'height' value = |{ height }| ).
    ENDIF.
    lo_c->end( ).
    result = me.
  ENDMETHOD.

  METHOD metric.
    DATA(lo_m) = ele( 'metric' )->prop( name = 'label' value = |{ label }| )->prop( name = 'value' value = |{ value }| ).
    IF delta IS SUPPLIED AND delta IS NOT INITIAL.
      lo_m->prop( name = 'delta' value = |{ delta }| ).
    ENDIF.
    lo_m->end( ).
    result = me.
  ENDMETHOD.

  METHOD table.
    ele( 'table' )->prop( name = 'data' value = |{ data }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD dataframe.
    ele( 'dataframe' )->prop( name = 'data' value = |{ data }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD json.
    ele( 'json' )->prop( name = 'data' value = |{ data }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD image.
    DATA(lo_img) = ele( 'image' )->prop( name = 'src' value = |{ src }| ).
    IF caption IS SUPPLIED.
      lo_img->prop( name = 'caption' value = |{ caption }| ).
    ENDIF.
    IF width IS SUPPLIED.
      lo_img->prop( name = 'width' value = |{ width }| ).
    ENDIF.
    lo_img->end( ).
    result = me.
  ENDMETHOD.

  METHOD audio.
    ele( 'audio' )->prop( name = 'src' value = |{ src }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD video.
    ele( 'video' )->prop( name = 'src' value = |{ src }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD success.
    ele( 'success' )->prop( name = 'text' value = |{ value }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD info.
    ele( 'info' )->prop( name = 'text' value = |{ value }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD warning.
    ele( 'warning' )->prop( name = 'text' value = |{ value }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD error.
    ele( 'error' )->prop( name = 'text' value = |{ value }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD toast.
    ele( 'toast' )->prop( name = 'text' value = |{ value }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD progress.
    DATA(lo_p) = ele( 'progress' )->prop( name = 'value' value = |{ value }| ).
    IF text IS SUPPLIED AND text IS NOT INITIAL.
      lo_p->prop( name = 'text' value = |{ text }| ).
    ENDIF.
    lo_p->end( ).
    result = me.
  ENDMETHOD.

  METHOD spinner.
    ele( 'spinner' )->prop( name = 'text' value = |{ value }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD balloons.
    ele( 'balloons' )->end( ).
    result = me.
  ENDMETHOD.

  METHOD snow.
    ele( 'snow' )->end( ).
    result = me.
  ENDMETHOD.

  METHOD badge.
    DATA(lo_b) = ele( 'badge' )->prop( name = 'text' value = |{ text }| ).
    IF color IS SUPPLIED.
      lo_b->prop( name = 'color' value = |{ color }| ).
    ENDIF.
    lo_b->end( ).
    result = me.
  ENDMETHOD.

  METHOD json_escape.
    result = escape( val    = val
                     format = cl_abap_format=>e_json_string ).
  ENDMETHOD.

  METHOD render.
    DATA lt_parts    TYPE string_table.
    DATA lt_children TYPE string_table.

    APPEND |"type":"{ json_escape( mv_type ) }"| TO lt_parts.

    LOOP AT mt_props ASSIGNING FIELD-SYMBOL(<ls_p>).
      APPEND |"{ json_escape( <ls_p>-name ) }":"{ json_escape( <ls_p>-value ) }"| TO lt_parts.
    ENDLOOP.

    IF mt_child IS NOT INITIAL.
      LOOP AT mt_child ASSIGNING FIELD-SYMBOL(<lo_child>).
        APPEND <lo_child>->render( ) TO lt_children.
      ENDLOOP.
      DATA(lv_kids) = concat_lines_of( table = lt_children sep = ',' ).
      APPEND |"children":[{ lv_kids }]| TO lt_parts.
    ENDIF.

    DATA(lv_content) = concat_lines_of( table = lt_parts sep = ',' ).
    result = |\{{ lv_content }\}|.
  ENDMETHOD.

  METHOD stringify.
    result = mo_root->render( ).
  ENDMETHOD.

ENDCLASS.
