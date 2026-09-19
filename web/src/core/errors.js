export class BindingError extends Error {
  constructor({ path, missingKey, parentPath, availableKeys = [] }) {
    const parentDesc = parentPath ? `object '${parentPath}'` : 'root state object';
    const keysHint = availableKeys.length > 0
      ? `Available properties in ${parentDesc}: [ ${availableKeys.join(', ')} ]`
      : `No properties found in ${parentDesc}.`;

    const usageHelp = [
      `Failed to resolve binding path: '${path}' (missing property: '${missingKey}').`,
      keysHint,
      '',
      'Troubleshooting & Usage Guide:',
      '1. Ensure the field is defined as a PUBLIC attribute of your ABAP application class (ZIF_ABAPLIT_APP).',
      '2. In ABAP, bind using: client->bind( ms_user-name ) or client->bind( mv_value ).',
      '3. In view templates, use valid dot notation: {MS_USER.NAME} or MS_USER.NAME.',
      '4. Property names are matched case-insensitively, but the structure path must exist in the state payload.'
    ].join('\n');

    super(usageHelp);
    this.name = 'BindingError';
    this.path = path;
    this.missingKey = missingKey;
    this.parentPath = parentPath;
    this.availableKeys = availableKeys;
  }
}

export class DataFormatError extends Error {
  constructor({ widget, expected, received, bindingPath }) {
    const bindingDesc = bindingPath ? ` (bound to '${bindingPath}')` : '';
    const message = [
      `Data error in widget '${widget}'${bindingDesc}: Expected ${expected}, but received ${received}.`,
      '',
      'Troubleshooting & Usage Guide:',
      `1. Pass a valid ${expected} directly in your ABAP view definition or bind with client->bind(...).`,
      '2. Internal tables should be bound to tables or charts using client->bind( mt_table ).',
      '3. abaplit does not use silent fallbacks; data must conform to widget expectations.'
    ].join('\n');

    super(message);
    this.name = 'DataFormatError';
    this.widget = widget;
    this.expected = expected;
    this.received = received;
    this.bindingPath = bindingPath;
  }
}
