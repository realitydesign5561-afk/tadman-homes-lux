---
*** Begin Patch
*** Update File: src/lib/properties.ts
@@
-    agent: agentName,
-   merchants: row.merchants
-  ? {
-      business_name: row.merchants.business_name,
-      whatsapp_number: row.merchants.whatsapp_number ?? (row.merchants.whatsapp || null),
-      whatsapp: row.merchants.whatsapp_number ?? row.merchants.whatsapp ?? null,
-      phone: row.merchants.phone ?? null,
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
