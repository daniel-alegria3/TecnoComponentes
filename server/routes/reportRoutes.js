const express = require('express');
const router = express.Router();
const htmlPdf = require('html-pdf-node');

// Main PDF generation route
router.get('/productstock', async (req, res) => {
    try {
        // Get products data from your API
        const products = await getProductsData();

        // Generate HTML content
        const htmlContent = generateProductReportHTML(products);

        // PDF generation options (similar to your original options)
        const options = {
            format: 'A4',
            margin: {
                top: '0.5in',
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in'
            },
            printBackground: true,
            preferCSSPageSize: true
        };

        const file = { content: htmlContent };

        // Generate PDF
        const pdfBuffer = await htmlPdf.generatePdf(file, options);

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=product-stock-report.pdf');
        res.setHeader('Content-Length', pdfBuffer.length);

        // Send the PDF
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error generating product stock report:', error);
        res.status(500).json({
            error: 'Failed to generate product stock report',
            details: error.message
        });
    }
});

// Optional: JSON endpoint that returns the same data (for testing)
router.get('/productstock/json', async (req, res) => {
    try {
        const products = await getProductsData();
        res.json({
            success: true,
            totalProducts: products.length,
            products: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            error: 'Failed to fetch products data',
            details: error.message
        });
    }
});

// Optional: Preview HTML in browser (for testing)
router.get('/productstock/preview', async (req, res) => {
    try {
        const products = await getProductsData();
        const htmlContent = generateProductReportHTML(products);
        res.setHeader('Content-Type', 'text/html');
        res.send(htmlContent);
    } catch (error) {
        console.error('Error generating preview:', error);
        res.status(500).json({
            error: 'Failed to generate preview',
            details: error.message
        });
    }
});


// Helper function to get products data
async function getProductsData() {
    try {
        const res = await fetch(`http://${process.env.FRONTEND_IP}:5000/api/clients/getproducts`);
        console.log(res)
        const rpta = await res.json();
        if (!res.ok) {
            throw new Error(rpta.error)
        }
        return rpta;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Failed to fetch products data');
    }
}

// Helper function to generate PDF-friendly HTML template
function generateProductReportHTML(products) {
    // Calculate summary statistics
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, product) => sum + (product.stock || 0), 0);
    const totalAvailableStock = products.reduce((sum, product) => sum + (product.available_stock || 0), 0);
    const averagePrice = totalProducts > 0 ?
        (products.reduce((sum, product) => sum + (parseFloat(product.price) || 0), 0) / totalProducts).toFixed(2) : 0;
    const lowStockCount = products.filter(product => (product.available_stock || 0) < 20).length;
    const outOfStockCount = products.filter(product => (product.available_stock || 0) === 0).length;

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Product Stock Report</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 15px;
                    color: #333;
                    line-height: 1.3;
                    font-size: 11px;
                }

                .header {
                    text-align: center;
                    border-bottom: 2px solid #3498db;
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                    page-break-inside: avoid;
                }

                .company-name {
                    font-size: 20px;
                    font-weight: bold;
                    color: #2c3e50;
                    margin-bottom: 6px;
                }

                .report-title {
                    font-size: 16px;
                    color: #3498db;
                    margin-bottom: 4px;
                }

                .report-date {
                    font-size: 10px;
                    color: #7f8c8d;
                }

                /* PDF-friendly summary - use flexbox instead of grid */
                .summary {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                    border: 1px solid #e9ecef;
                    page-break-inside: avoid;
                }

                .summary-item {
                    text-align: center;
                    background: white;
                    padding: 10px;
                    border-radius: 5px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    margin-bottom: 10px;
                    min-width: 90px;
                    flex: 1;
                    margin-right: 10px;
                }

                .summary-item:last-child {
                    margin-right: 0;
                }

                .summary-value {
                    font-size: 18px;
                    font-weight: bold;
                    color: #2c3e50;
                    margin-bottom: 4px;
                }

                .summary-label {
                    font-size: 9px;
                    color: #6c757d;
                    text-transform: uppercase;
                    font-weight: bold;
                }

                /* PDF-friendly table container */
                .table-container {
                    background: white;
                    border-radius: 5px;
                    overflow: visible;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    page-break-inside: auto;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    page-break-inside: auto;
                }

                /* Table header - ensure it repeats on each page */
                thead {
                    display: table-header-group;
                }

                tbody {
                    display: table-row-group;
                }

                th {
                    background-color: #3498db;
                    color: white;
                    padding: 8px 6px;
                    text-align: left;
                    font-weight: bold;
                    font-size: 10px;
                    white-space: nowrap;
                    page-break-after: avoid;
                    page-break-inside: avoid;
                }

                td {
                    padding: 6px;
                    border-bottom: 1px solid #e9ecef;
                    font-size: 9px;
                    vertical-align: top;
                    word-wrap: break-word;
                    word-break: break-word;
                    page-break-inside: avoid;
                }

                tr {
                    page-break-inside: avoid;
                    page-break-after: auto;
                }

                tr:nth-child(even) {
                    background-color: #f8f9fa;
                }

                /* Column widths for better fitting */
                .col-id { width: 8%; }
                .col-name { width: 25%; }
                .col-brand { width: 15%; }
                .col-category { width: 15%; }
                .col-price { width: 12%; }
                .col-stock { width: 10%; }
                .col-status { width: 15%; }

                .price {
                    font-weight: bold;
                    color: #27ae60;
                }

                .stock-critical {
                    color: #e74c3c;
                    font-weight: bold;
                }

                .stock-low {
                    color: #f39c12;
                    font-weight: bold;
                }

                .stock-good {
                    color: #27ae60;
                    font-weight: bold;
                }

                .status-badge {
                    padding: 2px 6px;
                    border-radius: 10px;
                    font-size: 8px;
                    font-weight: bold;
                    text-transform: uppercase;
                    color: white;
                    display: inline-block;
                }

                .status-critical {
                    background-color: #e74c3c;
                }

                .status-low {
                    background-color: #f39c12;
                }

                .status-good {
                    background-color: #27ae60;
                }

                .brand {
                    font-weight: bold;
                    color: #2c3e50;
                }

                .footer {
                    margin-top: 20px;
                    text-align: center;
                    font-size: 9px;
                    color: #6c757d;
                    border-top: 1px solid #e9ecef;
                    padding-top: 10px;
                    page-break-inside: avoid;
                }

                .no-products {
                    text-align: center;
                    color: #6c757d;
                    font-style: italic;
                    padding: 30px;
                    page-break-inside: avoid;
                }

                /* Print-specific styles */
                @media print {
                    body {
                        font-size: 10px;
                        padding: 10px;
                    }

                    .summary {
                        padding: 10px;
                        margin-bottom: 15px;
                    }

                    .summary-item {
                        padding: 8px;
                        margin-bottom: 5px;
                    }

                    table {
                        font-size: 8px;
                    }

                    th, td {
                        padding: 4px;
                    }

                    .status-badge {
                        font-size: 7px;
                        padding: 1px 4px;
                    }
                }

                /* Ensure proper page breaks */
                .page-break {
                    page-break-before: always;
                }

                .avoid-break {
                    page-break-inside: avoid;
                }
            </style>
        </head>
        <body>
            <div class="header avoid-break">
                <div class="company-name">TecnoComponentes</div>
                <div class="report-title">Reporte de Stock de Productos</div>
                <div class="report-date">Generado el ${new Date().toLocaleDateString('es-PE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}</div>
            </div>

            <div class="summary avoid-break">
                <div class="summary-item">
                    <div class="summary-value">${totalProducts}</div>
                    <div class="summary-label">Total Products</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">${totalStock}</div>
                    <div class="summary-label">Total Stock</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">$${averagePrice}</div>
                    <div class="summary-label">Average Price</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">${lowStockCount}</div>
                    <div class="summary-label">Low Stock Items</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">${outOfStockCount}</div>
                    <div class="summary-label">Out of Stock</div>
                </div>
            </div>

            ${products.length > 0 ? `
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th class="col-id">ID</th>
                                <th class="col-name">Nombre</th>
                                <th class="col-brand">Marca</th>
                                <th class="col-category">Categoria</th>
                                <th class="col-price">Precio</th>
                                <th class="col-stock">Stock</th>
                                <th class="col-status">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${products.map(product => {
                                const stock = product.stock || 0;
                                const availableStock = product.available_stock || 0;
                                const price = parseFloat(product.price) || 0;
                                const onSale = product.on_sale || 0;

                                let stockClass = 'stock-good';
                                let statusClass = 'status-good';
                                let statusText = 'Good';

                                if (availableStock === 0) {
                                    stockClass = 'stock-critical';
                                    statusClass = 'status-critical';
                                    statusText = 'Out of Stock';
                                } else if (availableStock < 10) {
                                    stockClass = 'stock-critical';
                                    statusClass = 'status-critical';
                                    statusText = 'Critical';
                                } else if (availableStock < 20) {
                                    stockClass = 'stock-low';
                                    statusClass = 'status-low';
                                    statusText = 'Low';
                                }

                                return `
                                    <tr>
                                        <td class="col-id">${product.id_product || 'N/A'}</td>
                                        <td class="col-name">
                                            ${product.name || 'Unknown Product'}
                                        </td>
                                        <td class="col-brand brand">${product.brand || 'Unknown'}</td>
                                        <td class="col-category">${product.category || 'Uncategorized'}</td>
                                        <td class="col-price price">$${price.toFixed(2)}</td>
                                        <td class="col-stock ${stockClass}">${stock}</td>
                                        <td class="col-status">
                                            <span class="status-badge ${statusClass}">
                                                ${statusText}
                                            </span>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            ` : `
                <div class="no-products avoid-break">
                    No products found to display in the report.
                </div>
            `}

            <div class="footer avoid-break">
                <p>Product Stock Report | Generated by Product Management System</p>
                <p>This document contains confidential business information</p>
            </div>
        </body>
        </html>
    `;
}

module.exports = router;

