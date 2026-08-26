**********************************************************************
*  INITIALIZE REFS BY PATH
**********************************************************************

class lcl_path_refs_init definition.
  public section.
    interfaces z2fiori_if_ajson_ref_init.

    methods constructor
      importing
        !it_data_refs type z2fiori_if_ajson_ref_init~tty_data_refs.

  private section.
    data mt_data_refs type z2fiori_if_ajson_ref_init~tty_data_refs.
endclass.

class lcl_path_refs_init implementation.

  method constructor.
    mt_data_refs = it_data_refs.
  endmethod.

  method z2fiori_if_ajson_ref_init~get_data_ref.

    field-symbols <data_ref> like line of mt_data_refs.

    read table mt_data_refs assigning <data_ref>
      with key by_path components path = is_node-path name = is_node-name.
    if sy-subrc = 0.
      ro_ref = <data_ref>-dref.
    endif.

  endmethod.
endclass.
