interface z2fiori_if_ajson_ref_init public.

  types:
    begin of ty_data_ref,
      path type string,
      name type string,
      dref type ref to data,
    end of ty_data_ref.
  types:
    tty_data_refs type standard table of ty_data_ref
      with unique sorted key by_path components path name.

  methods get_data_ref
    importing
      !is_node      type z2fiori_if_ajson_types=>ty_node
    returning
      value(ro_ref) type ref to data.

endinterface.
