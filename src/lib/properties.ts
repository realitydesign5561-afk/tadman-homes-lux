
-    agent: agentName,
-  merchants: row.merchants
  ? {
      business_name: row.merchants.business_name,
      whatsapp_number:
        row.merchants.whatsapp_number ?? row.merchants.whatsapp ?? null,
      whatsapp:
        row.merchants.whatsapp_number ?? row.merchants.whatsapp ?? null,
      phone: row.merchants.phone ?? null,
    }
  : null,
-    }
-  : null,
+    agent: agentName,
+    merchants: row.merchants
+      ? {
+          business_name: row.merchants.business_name,
+          whatsapp_number:
+            row.merchants.whatsapp_number ?? row.merchants.whatsapp ?? null,
+          whatsapp:
+            row.merchants.whatsapp_number ?? row.merchants.whatsapp ?? null,
+          phone: row.merchants.phone ?? null,
+        }
+      : null,
*** End Patch
