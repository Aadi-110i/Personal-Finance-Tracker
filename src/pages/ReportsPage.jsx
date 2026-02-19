import React from 'react';
import { useTransactions } from '../hooks/useTransactions';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FileDown, Calendar, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import './ReportsPage.css';

const ReportsPage = ({ user }) => {
    const { transactions, loading } = useTransactions(user?.uid);

    const generatePDF = () => {
        const doc = new jsPDF();

        // Add Logo/Title
        doc.setFontSize(20);
        doc.setTextColor(167, 139, 250); // Purple color
        doc.text('Finance Tracker Report', 14, 22);

        // Add Date
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        // Calculate Totals
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const netBalance = totalIncome - totalExpenses;

        // Add Summary Section
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Total Income: ${totalIncome.toFixed(2)}`, 14, 45);
        doc.text(`Total Expenses: ${totalExpenses.toFixed(2)}`, 14, 52);
        doc.text(`Net Balance: ${netBalance.toFixed(2)}`, 14, 59);

        // Add Table
        const tableColumn = ["Date", "Description", "Category", "Type", "Amount"];
        const tableRows = [];

        transactions.forEach(ticket => {
            const ticketData = [
                new Date(ticket.date).toLocaleDateString(),
                ticket.description,
                ticket.category,
                ticket.type.toUpperCase(),
                `${parseFloat(ticket.amount).toFixed(2)}`
            ];
            tableRows.push(ticketData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 70,
            theme: 'grid',
            headStyles: { fillColor: [139, 92, 246] }, // Purple header
            styles: { fontSize: 10, cellPadding: 3 },
        });

        doc.save(`FinanceTracker_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    if (loading) {
        return <div className="reports-loading">Loading data...</div>;
    }

    return (
        <div className="reports-page">
            <div className="reports-header">
                <div>
                    <h1 className="page-title">Financial Reports</h1>
                    <p className="page-subtitle">Download your transaction history and analysis.</p>
                </div>
                <button className="btn-download" onClick={generatePDF}>
                    <FileDown size={20} />
                    Download PDF
                </button>
            </div>

            <div className="report-preview">
                <div className="preview-header">
                    <FileText size={20} className="text-purple-400" />
                    <h2>Report Preview</h2>
                </div>

                {/* Simple Table Preview */}
                <div className="table-responsive">
                    <table className="preview-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Type</th>
                                <th className="text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.slice(0, 10).map((t) => (
                                <tr key={t.id}>
                                    <td>{new Date(t.date).toLocaleDateString()}</td>
                                    <td>{t.description}</td>
                                    <td>{t.category}</td>
                                    <td>
                                        <span className={`status-badge ${t.type}`}>
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        {t.type === 'income' ? '+' : '-'}₹{Number(t.amount).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {transactions.length > 10 && (
                        <p className="more-records">...and {transactions.length - 10} more records in PDF.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
