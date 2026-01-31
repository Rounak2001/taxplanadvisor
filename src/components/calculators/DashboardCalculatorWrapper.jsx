import React from 'react';

/**
 * Dashboard wrapper for calculators that passes isDashboard prop to children
 * This tells CalculatorLayout to hide the public Navbar/Footer
 */
export default function DashboardCalculatorWrapper({ children, backPath = '/dashboard/calculators' }) {
    // Clone children and pass isDashboard and backPath props
    return React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { isDashboard: true, backPath });
        }
        return child;
    });
}
