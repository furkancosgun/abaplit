CLASS z2fiori_cl_view_builder DEFINITION PUBLIC CREATE PRIVATE.

  PUBLIC SECTION.

    CLASS-METHODS factory
      RETURNING VALUE(result) TYPE REF TO z2fiori_cl_view_builder.

    METHODS ele
      IMPORTING n             TYPE string
                ns            TYPE string OPTIONAL
      RETURNING VALUE(result) TYPE REF TO z2fiori_cl_view_builder.

    METHODS tag
      IMPORTING n             TYPE string
                ns            TYPE string OPTIONAL
      RETURNING VALUE(result) TYPE REF TO z2fiori_cl_view_builder.

    METHODS a
      IMPORTING n             TYPE string
                v             TYPE string    OPTIONAL
                b             TYPE abap_bool OPTIONAL
      RETURNING VALUE(result) TYPE REF TO z2fiori_cl_view_builder.

    METHODS end
      RETURNING VALUE(result) TYPE REF TO z2fiori_cl_view_builder.

    METHODS root
      RETURNING VALUE(result) TYPE REF TO z2fiori_cl_view_builder.

    METHODS stringify
      RETURNING VALUE(result) TYPE string.

  PROTECTED SECTION.
    TYPES ty_t_node TYPE STANDARD TABLE OF REF TO z2fiori_cl_view_builder WITH EMPTY KEY.
    TYPES:
      BEGIN OF ty_s_name_value,
        n TYPE string,
        v TYPE string,
      END OF ty_s_name_value,
      ty_t_name_value TYPE STANDARD TABLE OF ty_s_name_value WITH EMPTY KEY.

    DATA mv_name   TYPE string.
    DATA mv_ns     TYPE string.
    DATA mt_pair   TYPE ty_t_name_value.
    DATA mt_child  TYPE ty_t_node.
    DATA mo_parent TYPE REF TO z2fiori_cl_view_builder.
    DATA mo_root   TYPE REF TO z2fiori_cl_view_builder.

    METHODS render
      RETURNING VALUE(result) TYPE string.

    METHODS xml_escape
      IMPORTING val           TYPE string
      RETURNING VALUE(result) TYPE string.
ENDCLASS.


CLASS z2fiori_cl_view_builder IMPLEMENTATION.
  METHOD factory.
    result = NEW #( ).
    result->mo_root = result.
  ENDMETHOD.

  METHOD ele.
    result = NEW #( ).
    result->mo_root = mo_root.
    result->mo_parent = me.
    result->mv_name = n.
    result->mv_ns = ns.
    APPEND result TO mt_child.
  ENDMETHOD.

  METHOD tag.
    ele( n  = n
         ns = ns ).
    result = me.
  ENDMETHOD.

  METHOD a.
    DATA lv_val    TYPE string.
    DATA lo_target TYPE REF TO z2fiori_cl_view_builder.

    ASSERT mv_name IS NOT INITIAL OR mt_child IS NOT INITIAL.

    lv_val = v.
    IF b IS SUPPLIED.
      ASSERT v IS INITIAL.
      lv_val = COND #( WHEN b = abap_true THEN 'true' ELSE 'false' ).
    ENDIF.

    IF mt_child IS INITIAL.
      ASSERT NOT line_exists( mt_pair[ n = n ] ).
      APPEND VALUE #( n = n
                      v = lv_val ) TO mt_pair.
    ELSE.
      lo_target = mt_child[ lines( mt_child ) ].
      ASSERT NOT line_exists( lo_target->mt_pair[ n = n ] ).
      APPEND VALUE #( n = n
                      v = lv_val ) TO lo_target->mt_pair.
    ENDIF.
    result = me.
  ENDMETHOD.

  METHOD end.
    ASSERT mo_parent IS BOUND.
    result = mo_parent.
  ENDMETHOD.

  METHOD root.
    result = mo_root.
  ENDMETHOD.

  METHOD render.
    DATA lt_inner TYPE string_table.
    DATA lv_inner TYPE string.
    DATA lv_qname TYPE string.
    DATA lv_attrs TYPE string.
    DATA lo_child LIKE LINE OF mt_child.
    DATA ls_pair  LIKE LINE OF mt_pair.

    LOOP AT mt_child INTO lo_child.
      APPEND lo_child->render( ) TO lt_inner.
    ENDLOOP.
    lv_inner = concat_lines_of( lt_inner ).

    IF mv_name IS INITIAL.
      result = lv_inner.
      RETURN.
    ENDIF.

    lv_qname = COND string( WHEN mv_ns IS INITIAL THEN mv_name ELSE |{ mv_ns }:{ mv_name }| ).
    lv_attrs = ``.
    LOOP AT mt_pair INTO ls_pair.
      lv_attrs = |{ lv_attrs } { ls_pair-n }="{ xml_escape( ls_pair-v ) }"|.
    ENDLOOP.

    IF mt_child IS INITIAL.
      result = |<{ lv_qname }{ lv_attrs }/>|.
    ELSE.
      result = |<{ lv_qname }{ lv_attrs }>{ lv_inner }</{ lv_qname }>|.
    ENDIF.
  ENDMETHOD.

  METHOD xml_escape.
    result = escape( val    = val
                     format = cl_abap_format=>e_xml_attr ).
  ENDMETHOD.

  METHOD stringify.
    result = mo_root->render( ).
  ENDMETHOD.
ENDCLASS.