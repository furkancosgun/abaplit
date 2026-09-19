CLASS zcl_abaplit_view_builder DEFINITION
  PUBLIC
  CREATE PUBLIC.

  PUBLIC SECTION.
    TYPES:
      BEGIN OF ty_s_prop,
        name  TYPE string,
        value TYPE string,
      END OF ty_s_prop,
      ty_t_prop TYPE STANDARD TABLE OF ty_s_prop WITH EMPTY KEY.

    CLASS-METHODS factory
      IMPORTING
        type          TYPE string OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    " --- Layout & Hierarchy ---
    METHODS ele
      IMPORTING
        type          TYPE string
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS tag
      IMPORTING
        type          TYPE string
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS a
      IMPORTING
        n             TYPE string
        v             TYPE string    OPTIONAL
        b             TYPE abap_bool OPTIONAL
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

    " --- Text & Typography ---
    METHODS title
      IMPORTING
        val           TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS header
      IMPORTING
        val           TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS subheader
      IMPORTING
        val           TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS write
      IMPORTING
        val           TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS text
      IMPORTING
        val           TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS markdown
      IMPORTING
        val           TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS caption
      IMPORTING
        val           TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS code
      IMPORTING
        val           TYPE clike
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
        event         TYPE clike OPTIONAL
        type          TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS text_input
      IMPORTING
        label         TYPE clike
        value         TYPE clike OPTIONAL
        placeholder   TYPE clike OPTIONAL
        event         TYPE clike OPTIONAL
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
        event         TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS text_area
      IMPORTING
        label         TYPE clike
        value         TYPE clike OPTIONAL
        placeholder   TYPE clike OPTIONAL
        height        TYPE clike OPTIONAL
        event         TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS checkbox
      IMPORTING
        label         TYPE clike
        value         TYPE clike OPTIONAL
        event         TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS radio
      IMPORTING
        label         TYPE clike
        options       TYPE clike OPTIONAL
        value         TYPE clike OPTIONAL
        event         TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS selectbox
      IMPORTING
        label         TYPE clike
        options       TYPE clike OPTIONAL
        value         TYPE clike OPTIONAL
        event         TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS multiselect
      IMPORTING
        label         TYPE clike
        options       TYPE clike OPTIONAL
        value         TYPE clike OPTIONAL
        event         TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS slider
      IMPORTING
        label         TYPE clike
        min           TYPE clike OPTIONAL
        max           TYPE clike OPTIONAL
        value         TYPE clike OPTIONAL
        event         TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS date_input
      IMPORTING
        label         TYPE clike
        value         TYPE clike OPTIONAL
        event         TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS time_input
      IMPORTING
        label         TYPE clike
        value         TYPE clike OPTIONAL
        event         TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    " --- Data Display ---
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

    " --- Feedback & Alerts ---
    METHODS success
      IMPORTING
        val           TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS info
      IMPORTING
        val           TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS warning
      IMPORTING
        val           TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS error
      IMPORTING
        val           TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS toast
      IMPORTING
        val           TYPE clike
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS progress
      IMPORTING
        val           TYPE clike
        text          TYPE clike OPTIONAL
      RETURNING
        VALUE(result) TYPE REF TO zcl_abaplit_view_builder.

    METHODS spinner
      IMPORTING
        val           TYPE clike
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

  METHOD tag.
    ele( type ).
    result = me.
  ENDMETHOD.

  METHOD prop.
    APPEND VALUE #( name  = name
                    value = value ) TO mt_props.
    result = me.
  ENDMETHOD.

  METHOD a.
    DATA(lv_val) = v.
    IF b IS SUPPLIED.
      lv_val = COND #( WHEN b = abap_true THEN 'true' ELSE 'false' ).
    ENDIF.
    IF mt_child IS INITIAL.
      prop( name = n value = lv_val ).
    ELSE.
      DATA(lo_target) = mt_child[ lines( mt_child ) ].
      lo_target->prop( name = n value = lv_val ).
    ENDIF.
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

  METHOD title.
    ele( 'title' )->prop( name = 'text' value = |{ val }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD header.
    ele( 'header' )->prop( name = 'text' value = |{ val }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD subheader.
    ele( 'subheader' )->prop( name = 'text' value = |{ val }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD write.
    ele( 'write' )->prop( name = 'text' value = |{ val }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD text.
    ele( 'text' )->prop( name = 'text' value = |{ val }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD markdown.
    ele( 'markdown' )->prop( name = 'body' value = |{ val }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD caption.
    ele( 'caption' )->prop( name = 'text' value = |{ val }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD code.
    DATA(lo_code) = ele( 'code' )->prop( name = 'code' value = |{ val }| ).
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
    IF event IS SUPPLIED AND event IS NOT INITIAL.
      lo_btn->prop( name = 'event' value = |{ event }| ).
    ENDIF.
    IF type IS SUPPLIED AND type IS NOT INITIAL.
      lo_btn->prop( name = 'btn_type' value = |{ type }| ).
    ENDIF.
    lo_btn->end( ).
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
    IF event IS SUPPLIED AND event IS NOT INITIAL.
      lo_inp->prop( name = 'event' value = |{ event }| ).
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
    IF event IS SUPPLIED AND event IS NOT INITIAL.
      lo_inp->prop( name = 'event' value = |{ event }| ).
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
    IF event IS SUPPLIED AND event IS NOT INITIAL.
      lo_inp->prop( name = 'event' value = |{ event }| ).
    ENDIF.
    lo_inp->end( ).
    result = me.
  ENDMETHOD.

  METHOD checkbox.
    DATA(lo_inp) = ele( 'checkbox' )->prop( name = 'label' value = |{ label }| ).
    IF value IS SUPPLIED.
      lo_inp->prop( name = 'value' value = |{ value }| ).
    ENDIF.
    IF event IS SUPPLIED AND event IS NOT INITIAL.
      lo_inp->prop( name = 'event' value = |{ event }| ).
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
    IF event IS SUPPLIED AND event IS NOT INITIAL.
      lo_inp->prop( name = 'event' value = |{ event }| ).
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
    IF event IS SUPPLIED AND event IS NOT INITIAL.
      lo_inp->prop( name = 'event' value = |{ event }| ).
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
    IF event IS SUPPLIED AND event IS NOT INITIAL.
      lo_inp->prop( name = 'event' value = |{ event }| ).
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
    IF event IS SUPPLIED AND event IS NOT INITIAL.
      lo_inp->prop( name = 'event' value = |{ event }| ).
    ENDIF.
    lo_inp->end( ).
    result = me.
  ENDMETHOD.

  METHOD date_input.
    DATA(lo_inp) = ele( 'date_input' )->prop( name = 'label' value = |{ label }| ).
    IF value IS SUPPLIED.
      lo_inp->prop( name = 'value' value = |{ value }| ).
    ENDIF.
    IF event IS SUPPLIED AND event IS NOT INITIAL.
      lo_inp->prop( name = 'event' value = |{ event }| ).
    ENDIF.
    lo_inp->end( ).
    result = me.
  ENDMETHOD.

  METHOD time_input.
    DATA(lo_inp) = ele( 'time_input' )->prop( name = 'label' value = |{ label }| ).
    IF value IS SUPPLIED.
      lo_inp->prop( name = 'value' value = |{ value }| ).
    ENDIF.
    IF event IS SUPPLIED AND event IS NOT INITIAL.
      lo_inp->prop( name = 'event' value = |{ event }| ).
    ENDIF.
    lo_inp->end( ).
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

  METHOD success.
    ele( 'success' )->prop( name = 'text' value = |{ val }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD info.
    ele( 'info' )->prop( name = 'text' value = |{ val }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD warning.
    ele( 'warning' )->prop( name = 'text' value = |{ val }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD error.
    ele( 'error' )->prop( name = 'text' value = |{ val }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD toast.
    ele( 'toast' )->prop( name = 'text' value = |{ val }| )->end( ).
    result = me.
  ENDMETHOD.

  METHOD progress.
    DATA(lo_p) = ele( 'progress' )->prop( name = 'value' value = |{ val }| ).
    IF text IS SUPPLIED AND text IS NOT INITIAL.
      lo_p->prop( name = 'text' value = |{ text }| ).
    ENDIF.
    lo_p->end( ).
    result = me.
  ENDMETHOD.

  METHOD spinner.
    ele( 'spinner' )->prop( name = 'text' value = |{ val }| )->end( ).
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
