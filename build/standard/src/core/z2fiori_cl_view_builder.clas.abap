CLASS z2fiori_cl_view_builder DEFINITION PUBLIC CREATE PRIVATE.

  PUBLIC SECTION.
    CLASS-METHODS factory
      RETURNING VALUE(result) TYPE REF TO z2fiori_cl_view_builder.

    METHODS ele
      IMPORTING !n            TYPE string
                !ns           TYPE string OPTIONAL
      RETURNING VALUE(result) TYPE REF TO z2fiori_cl_view_builder.

    METHODS tag
      IMPORTING !n            TYPE string
                !ns           TYPE string OPTIONAL
      RETURNING VALUE(result) TYPE REF TO z2fiori_cl_view_builder.

    METHODS a
      IMPORTING !n            TYPE string
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
    TYPES ty_t_node TYPE STANDARD TABLE OF REF TO z2fiori_cl_view_builder WITH DEFAULT KEY.
    TYPES:
      BEGIN OF ty_s_name_value,
        n TYPE string,
        v TYPE string,
      END OF ty_s_name_value,
      ty_t_name_value TYPE STANDARD TABLE OF ty_s_name_value WITH DEFAULT KEY.

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
    CREATE OBJECT result.
    result->mo_root = result.
  ENDMETHOD.

  METHOD ele.
    CREATE OBJECT result.
    result->mo_root   = mo_root.
    result->mo_parent = me.
    result->mv_name   = n.
    result->mv_ns     = ns.
    APPEND result TO mt_child.
  ENDMETHOD.

  METHOD tag.
    ele( n  = n
         ns = ns ).
    result = me.
  ENDMETHOD.

  METHOD a.
    DATA lv_val LIKE v.
      DATA temp1 TYPE string.
      DATA temp2 LIKE sy-subrc.
      DATA temp3 TYPE z2fiori_cl_view_builder=>ty_s_name_value.
      DATA lo_target LIKE LINE OF mt_child.
      DATA temp6 LIKE LINE OF mt_child.
      DATA temp7 LIKE sy-tabix.
      DATA temp4 LIKE sy-subrc.
      DATA temp5 TYPE z2fiori_cl_view_builder=>ty_s_name_value.
    ASSERT mv_name IS NOT INITIAL OR mt_child IS NOT INITIAL.

    
    lv_val = v.
    IF b IS SUPPLIED.
      ASSERT v IS INITIAL.
      
      IF b = abap_true.
        temp1 = 'true'.
      ELSE.
        temp1 = 'false'.
      ENDIF.
      lv_val = temp1.
    ENDIF.

    IF mt_child IS INITIAL.
      
      READ TABLE mt_pair WITH KEY n = n TRANSPORTING NO FIELDS.
      temp2 = sy-subrc.
      ASSERT NOT temp2 = 0.
      
      CLEAR temp3.
      temp3-n = n.
      temp3-v = lv_val.
      APPEND temp3 TO mt_pair.
    ELSE.
      
      
      
      temp7 = sy-tabix.
      READ TABLE mt_child INDEX lines( mt_child ) INTO temp6.
      sy-tabix = temp7.
      IF sy-subrc <> 0.
        RAISE EXCEPTION TYPE cx_sy_itab_line_not_found.
      ENDIF.
      lo_target = temp6.
      
      READ TABLE lo_target->mt_pair WITH KEY n = n TRANSPORTING NO FIELDS.
      temp4 = sy-subrc.
      ASSERT NOT temp4 = 0.
      
      CLEAR temp5.
      temp5-n = n.
      temp5-v = lv_val.
      APPEND temp5 TO lo_target->mt_pair.
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

    FIELD-SYMBOLS <lo_child> LIKE LINE OF mt_child.
    DATA lv_inner TYPE string.
    DATA temp6 TYPE string.
    DATA lv_qname LIKE temp6.
    DATA lv_attrs TYPE string.
    FIELD-SYMBOLS <ls_pair> LIKE LINE OF mt_pair.
    LOOP AT mt_child ASSIGNING <lo_child>.
      APPEND <lo_child>->render( ) TO lt_inner.
    ENDLOOP.
    
    lv_inner = concat_lines_of( lt_inner ).

    IF mv_name IS INITIAL.
      result = lv_inner.
      RETURN.
    ENDIF.

    
    IF mv_ns IS INITIAL.
      temp6 = mv_name.
    ELSE.
      temp6 = |{ mv_ns }:{ mv_name }|.
    ENDIF.
    
    lv_qname = temp6.
    
    lv_attrs = ``.
    
    LOOP AT mt_pair ASSIGNING <ls_pair>.
      lv_attrs = |{ lv_attrs } { <ls_pair>-n }="{ xml_escape( <ls_pair>-v ) }"|.
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
