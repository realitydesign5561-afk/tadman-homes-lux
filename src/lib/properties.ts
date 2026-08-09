// Keep your existing imports/types above this section unchanged.

// Ensure the mapped object is inside a valid return/object expression.
// The key fix is restoring proper object structure around `agent` and `merchants`.

/*
Example corrected block (replace your broken block with this exact structure
inside your mapper/transform function):
*/

{
  agent: agentName,
  merchants: row.merchants
    ? {
        business_name: row.merchants.business_name,
        whatsapp_number:
          row.merchants.whatsapp_number ?? row.merchants.whatsapp ?? null,
        whatsapp:
          row.merchants.whatsapp_number ?? row.merchants.whatsapp ?? null,
        phone: row.merchants.phone ?? null,
      }
    : null,
}
