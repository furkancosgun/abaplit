interface z2fiori_if_ajson_iterator
  public.

  methods has_next
    returning
      value(rv_yes) type abap_bool.

  methods next
    returning
      value(ri_item) type ref to z2fiori_if_ajson.

endinterface.
