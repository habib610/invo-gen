import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";

// Register standard fonts if needed, or stick to standard Helvetica.
// For elegance, we'll use a clean layout with Helvetica.

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1f2937"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4
  },
  logo: {
    width: 100,
    height: 40,
    backgroundColor: "#f3f4f6", // Placeholder if no logo provided
    marginBottom: 10
  },
  section: {
    marginBottom: 30
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  col: {
    flexDirection: "column",
    width: "45%"
  },
  h3: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#374151",
    textTransform: "uppercase"
  },
  text: {
    marginBottom: 3,
    lineHeight: 1.4
  },
  table: {
    width: "100%",
    marginTop: 20
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 8,
    marginBottom: 8
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6"
  },
  col1: { width: "40%" },
  col2: { width: "20%", textAlign: "center" },
  col3: { width: "20%", textAlign: "center" },
  col4: { width: "20%", textAlign: "right" },
  boldText: {
    fontWeight: "bold"
  },
  totalsContainer: {
    marginTop: 20,
    width: "50%",
    alignSelf: "flex-end"
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb"
  },
  grandTotalText: {
    fontSize: 14,
    fontWeight: "bold"
  },
  paymentSection: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb"
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 8
  }
});


























export const ElegantInvoiceTemplate = ({ data }) => {
  return (
    <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>INVOICE</Text>
                        <Text style={styles.subtitle}>
                            #{data.invoice_number}
                        </Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={styles.h3}>{data.vendor.name}</Text>
                        <Text style={styles.text}>{data.vendor.address}</Text>
                        <Text style={styles.text}>{data.vendor.email}</Text>
                        {data.vendor.phone &&
            <Text style={styles.text}>{data.vendor.phone}</Text>
            }
                    </View>
                </View>

                {/* Info Rows */}
                <View style={[styles.row, styles.section]}>
                    <View style={styles.col}>
                        <Text style={styles.h3}>Bill To:</Text>
                        <Text style={styles.text}>Client Company Name</Text>
                        <Text style={styles.text}>Client Address</Text>
                        {/* The prompt didn't explicitly specify client module, so we can make it a generic label or pass via props later */}
                    </View>
                    <View style={styles.col}>
                        <View style={styles.totalRow}>
                            <Text style={styles.boldText}>Invoice Date:</Text>
                            <Text>
                                {format(
                  new Date(data.invoice_date),
                  "MMM dd, yyyy"
                )}
                            </Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.boldText}>Due Date:</Text>
                            <Text>
                                {format(
                  new Date(data.due_date),
                  "MMM dd, yyyy"
                )}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.col1, styles.boldText]}>
                            Description
                        </Text>
                        <Text style={[styles.col2, styles.boldText]}>
                            Quantity
                        </Text>
                        <Text style={[styles.col3, styles.boldText]}>
                            Price
                        </Text>
                        <Text style={[styles.col4, styles.boldText]}>
                            Total
                        </Text>
                    </View>
                    {data.items.map((item, index) =>
          <View key={index} style={styles.tableRow}>
                            <Text style={styles.col1}>{item.description}</Text>
                            <Text style={styles.col2}>{item.quantity}</Text>
                            <Text style={styles.col3}>
                                ${Number(item.price).toFixed(2)}
                            </Text>
                            <Text style={styles.col4}>
                                ${Number(item.total).toFixed(2)}
                            </Text>
                        </View>
          )}
                </View>

                {/* Totals */}
                <View style={styles.totalsContainer}>
                    <View style={styles.totalRow}>
                        <Text>Subtotal</Text>
                        <Text>${Number(data.subtotal).toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text>Tax</Text>
                        <Text>${Number(data.tax).toFixed(2)}</Text>
                    </View>
                    <View style={styles.grandTotalRow}>
                        <Text style={styles.grandTotalText}>Total Due</Text>
                        <Text style={styles.grandTotalText}>
                            ${Number(data.total).toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* Payment Details */}
                {data.payment_method &&
        <View style={styles.paymentSection}>
                        <Text style={styles.h3}>
                            Payment Method: {data.payment_method.name}
                        </Text>
                        <Text style={styles.text}>
                            {data.payment_method.details}
                        </Text>
                    </View>
        }

                {/* Footer */}
                <Text style={styles.footer}>
                    Thank you for your business! If you have any questions,
                    please contact us.
                </Text>
            </Page>
        </Document>);

};