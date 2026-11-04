<style>
    /* =========================================================================
       Multiserwis Kutno • Usługi — Twin CMS Architecture (Light & Dark Mode)
       ========================================================================= */

    /* Brand Logo in Sidebar Header */
    .ms-brand-wrap {
        display: flex;
        align-items: center;
        gap: 12px;
        text-decoration: none;
    }
    .ms-brand-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
        flex-shrink: 0;
    }
    .ms-brand-text {
        display: flex;
        flex-direction: column;
        line-height: 1.1;
    }
    .ms-brand-title {
        font-size: 18px;
        font-weight: 900;
        letter-spacing: 0.04em;
        color: #ffffff;
        text-transform: uppercase;
    }
    .ms-brand-subtitle {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.18em;
        color: #94a3b8;
        text-transform: uppercase;
        margin-top: 3px;
    }

    /* Dark Navy/Teal Sidebar (matching Szkolenia CMS structure) */
    .fi-sidebar {
        background-color: #091720 !important;
        border-right: 1px solid rgba(255, 255, 255, 0.06) !important;
    }
    .fi-sidebar-header {
        background-color: #091720 !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
        padding-top: 1.1rem !important;
        padding-bottom: 1.1rem !important;
    }
    .fi-sidebar-nav {
        padding: 1rem 0.85rem !important;
    }

    /* Sidebar Navigation Items */
    .fi-sidebar-item-btn,
    .fi-sidebar-item-button {
        border-radius: 10px !important;
        padding: 0.65rem 0.9rem !important;
        transition: all 0.18s ease !important;
    }
    .fi-sidebar-item:not(.fi-active) .fi-sidebar-item-btn,
    .fi-sidebar-item:not(.fi-active) .fi-sidebar-item-button {
        color: #94a3b8 !important;
    }
    .fi-sidebar-item:not(.fi-active) .fi-sidebar-item-label {
        color: #cbd5e1 !important;
        font-weight: 600 !important;
        font-size: 0.9rem !important;
    }
    .fi-sidebar-item:not(.fi-active) .fi-sidebar-item-icon {
        color: #94a3b8 !important;
    }
    .fi-sidebar-item:not(.fi-active) .fi-sidebar-item-btn:hover,
    .fi-sidebar-item:not(.fi-active) .fi-sidebar-item-button:hover {
        background-color: rgba(255, 255, 255, 0.06) !important;
    }
    .fi-sidebar-item:not(.fi-active) .fi-sidebar-item-btn:hover .fi-sidebar-item-label,
    .fi-sidebar-item:not(.fi-active) .fi-sidebar-item-button:hover .fi-sidebar-item-label {
        color: #ffffff !important;
    }

    /* Active Sidebar Pill (Industrial Amber for Usługi) */
    .fi-sidebar-item.fi-active .fi-sidebar-item-btn,
    .fi-sidebar-item.fi-active .fi-sidebar-item-button {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
        box-shadow: 0 6px 18px rgba(245, 158, 11, 0.28) !important;
    }
    .fi-sidebar-item.fi-active .fi-sidebar-item-label,
    .fi-sidebar-item.fi-active .fi-sidebar-item-icon {
        color: #ffffff !important;
        font-weight: 700 !important;
    }

    /* Sidebar Badges */
    .fi-sidebar-item .fi-badge {
        background-color: rgba(148, 163, 184, 0.18) !important;
        color: #e2e8f0 !important;
        border-radius: 9999px !important;
        padding: 2px 8px !important;
        font-size: 11px !important;
        font-weight: 700 !important;
    }
    .fi-sidebar-item.fi-active .fi-badge {
        background-color: rgba(15, 23, 42, 0.28) !important;
        color: #ffffff !important;
    }

    /* Sidebar Footer (Portal Link + Admin Profile Row) */
    .ms-sidebar-footer {
        padding: 14px 14px 16px 14px;
        border-top: 1px solid rgba(255, 255, 255, 0.07);
        background-color: #07131b;
    }
    .ms-portal-btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 9px 12px;
        border-radius: 10px;
        border: 1px solid rgba(148, 163, 184, 0.18);
        background-color: rgba(255, 255, 255, 0.03);
        color: #cbd5e1;
        font-size: 12px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.18s ease;
        margin-bottom: 14px;
    }
    .ms-portal-btn:hover {
        background-color: rgba(255, 255, 255, 0.08);
        border-color: rgba(245, 158, 11, 0.45);
        color: #ffffff;
    }
    .ms-portal-btn-left {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .ms-user-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
    }
    .ms-user-profile-link {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
        min-width: 0;
        text-decoration: none;
        padding: 5px 6px;
        margin: -5px -6px;
        border-radius: 10px;
        transition: background-color 0.15s ease;
    }
    .ms-user-profile-link:hover {
        background-color: rgba(255, 255, 255, 0.06);
    }
    .ms-user-profile-link:hover .ms-user-email {
        color: #fbbf24;
    }
    .ms-user-avatar {
        width: 34px;
        height: 34px;
        border-radius: 9999px;
        background: rgba(245, 158, 11, 0.22);
        border: 1px solid rgba(245, 158, 11, 0.5);
        color: #fbbf24;
        font-weight: 800;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    .ms-user-info {
        flex: 1;
        min-width: 0;
    }
    .ms-user-email {
        font-size: 12.5px;
        font-weight: 700;
        color: #ffffff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .ms-user-role {
        font-size: 11px;
        color: #64748b;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .ms-logout-btn {
        background: transparent;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        padding: 6px;
        border-radius: 8px;
        transition: all 0.15s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .ms-logout-btn:hover {
        color: #ffffff;
        background-color: rgba(255, 255, 255, 0.08);
    }

    /* Topbar Pill Button & Theme Toggle */
    .ms-topbar-pill-wrap {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-right: 6px;
    }
    .ms-theme-toggle-btn {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 6px 13px;
        border-radius: 10px;
        border: 1px solid rgba(148, 163, 184, 0.28);
        background-color: rgba(248, 250, 252, 0.9);
        color: #0f172a;
        font-size: 12.5px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s ease;
    }
    html.dark .ms-theme-toggle-btn {
        background-color: rgba(30, 41, 59, 0.9);
        border-color: rgba(148, 163, 184, 0.22);
        color: #f8fafc;
    }
    .ms-theme-toggle-btn:hover {
        border-color: #f59e0b;
        background-color: #ffffff;
    }
    html.dark .ms-theme-toggle-btn:hover {
        border-color: #f59e0b;
        background-color: #1e293b;
    }
    .ms-topbar-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: 10px;
        border: 1px solid rgba(148, 163, 184, 0.28);
        background-color: rgba(248, 250, 252, 0.9);
        color: #0f172a;
        font-size: 12.5px;
        font-weight: 700;
        text-decoration: none;
        transition: all 0.15s ease;
    }
    html.dark .ms-topbar-pill {
        background-color: rgba(30, 41, 59, 0.9);
        border-color: rgba(148, 163, 184, 0.22);
        color: #f8fafc;
    }
    .ms-topbar-pill:hover {
        border-color: #f59e0b;
    }

    /* Form Sections & Settings Cards Visual Polish */
    .fi-section {
        border-radius: 16px !important;
        border: 1px solid #e2e8f0 !important;
        box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03) !important;
        overflow: hidden;
    }
    html.dark .fi-section {
        background-color: #1e293b !important;
        border-color: #334155 !important;
    }
    .fi-section-header {
        background-color: rgba(248, 250, 252, 0.75);
        border-bottom: 1px solid rgba(226, 232, 240, 0.8);
        padding: 16px 22px !important;
    }
    html.dark .fi-section-header {
        background-color: rgba(15, 23, 42, 0.4);
        border-bottom-color: rgba(51, 65, 85, 0.8);
    }
    .fi-section-header-icon {
        width: 36px !important;
        height: 36px !important;
        padding: 7px !important;
        border-radius: 10px !important;
        background-color: rgba(245, 158, 11, 0.14) !important;
        color: #d97706 !important;
        flex-shrink: 0;
    }
    html.dark .fi-section-header-icon {
        background-color: rgba(245, 158, 11, 0.18) !important;
        color: #fbbf24 !important;
    }
    .fi-section-content {
        padding: 22px !important;
    }

    /* Hide duplicate Filament user menu in topbar (profile & logout live in sidebar footer) */
    .fi-topbar .fi-user-menu {
        display: none !important;
    }

    /* Main Content Area Background (Light & Softer Slate Dark Mode) */
    body.fi-body {
        background-color: #f3f6f9 !important;
    }
    html.dark body.fi-body {
        background-color: #0f172a !important;
    }

    /* Hide default Filament page header on Dashboard since we render the Hero Banner */
    .fi-page-dashboard .fi-header {
        display: none !important;
    }

    /* =========================================================================
       Dashboard Components (Hero Banner + 4 KPI Cards + 2-Col Analytics)
       ========================================================================= */
    .ms-dash-hero {
        background: radial-gradient(circle at 85% 20%, rgba(245, 158, 11, 0.16), transparent 45%),
                    linear-gradient(135deg, #091720 0%, #0d2533 60%, #112d3d 100%);
        border-radius: 18px;
        padding: 30px 34px;
        color: #ffffff;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        box-shadow: 0 12px 30px -10px rgba(9, 23, 32, 0.35);
        margin-bottom: 26px;
        border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .ms-dash-hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 12px;
        border-radius: 9999px;
        background-color: rgba(245, 158, 11, 0.14);
        border: 1px solid rgba(245, 158, 11, 0.32);
        color: #fbbf24;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.01em;
        margin-bottom: 14px;
    }
    .ms-dash-hero-title {
        font-size: 28px;
        font-weight: 900;
        line-height: 1.2;
        color: #ffffff;
        margin: 0 0 10px 0;
        letter-spacing: -0.02em;
    }
    .ms-dash-hero-desc {
        font-size: 14px;
        line-height: 1.6;
        color: #cbd5e1;
        max-width: 540px;
        margin: 0;
    }
    .ms-dash-hero-desc strong {
        color: #ffffff;
        font-weight: 700;
    }
    .ms-dash-hero-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 12px;
    }
    .ms-btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        border-radius: 11px;
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: #ffffff;
        font-size: 13px;
        font-weight: 700;
        text-decoration: none;
        box-shadow: 0 6px 16px rgba(245, 158, 11, 0.32);
        transition: all 0.18s ease;
    }
    .ms-btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 8px 20px rgba(245, 158, 11, 0.45);
    }
    .ms-btn-secondary {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 18px;
        border-radius: 11px;
        background-color: rgba(255, 255, 255, 0.09);
        border: 1px solid rgba(255, 255, 255, 0.16);
        color: #f8fafc;
        font-size: 13px;
        font-weight: 700;
        text-decoration: none;
        transition: all 0.18s ease;
    }
    .ms-btn-secondary:hover {
        background-color: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.3);
    }

    /* 4 KPI Cards Row */
    .ms-kpi-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 20px;
        margin-bottom: 26px;
    }
    @media (max-width: 1200px) {
        .ms-kpi-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }
    @media (max-width: 640px) {
        .ms-kpi-grid {
            grid-template-columns: 1fr;
        }
    }
    .ms-kpi-card {
        background-color: #ffffff;
        border-radius: 16px;
        padding: 22px 24px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-decoration: none;
        transition: all 0.18s ease;
    }
    html.dark .ms-kpi-card {
        background-color: #1e293b;
        border-color: #334155;
    }
    .ms-kpi-card:hover {
        transform: translateY(-2px);
        border-color: #f59e0b;
        box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
    }
    .ms-kpi-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
    }
    .ms-kpi-label {
        font-size: 12.5px;
        font-weight: 700;
        color: #64748b;
    }
    html.dark .ms-kpi-label {
        color: #94a3b8;
    }
    .ms-kpi-icon {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .ms-kpi-value {
        font-size: 30px;
        font-weight: 900;
        color: #0f172a;
        line-height: 1.15;
        margin-bottom: 10px;
        letter-spacing: -0.02em;
    }
    html.dark .ms-kpi-value {
        color: #f8fafc;
    }
    .ms-kpi-meta {
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
    }
    html.dark .ms-kpi-meta {
        color: #94a3b8;
    }

    /* Bottom 2-Column Section */
    .ms-bottom-grid {
        display: grid;
        grid-template-columns: 7fr 5fr;
        gap: 22px;
    }
    @media (max-width: 1024px) {
        .ms-bottom-grid {
            grid-template-columns: 1fr;
        }
    }
    .ms-panel-card {
        background-color: #ffffff;
        border-radius: 16px;
        padding: 26px 28px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
    }
    html.dark .ms-panel-card {
        background-color: #1e293b;
        border-color: #334155;
    }
    .ms-panel-header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        margin-bottom: 22px;
        gap: 12px;
    }
    .ms-panel-eyebrow {
        font-size: 12px;
        font-weight: 700;
        color: #d97706;
        margin-bottom: 4px;
    }
    html.dark .ms-panel-eyebrow {
        color: #fbbf24;
    }
    .ms-panel-title {
        font-size: 18px;
        font-weight: 800;
        color: #0f172a;
        margin: 0;
    }
    html.dark .ms-panel-title {
        color: #f8fafc;
    }
    .ms-panel-link {
        font-size: 12.5px;
        font-weight: 700;
        color: #0f172a;
        text-decoration: none;
        white-space: nowrap;
    }
    html.dark .ms-panel-link {
        color: #cbd5e1;
    }
    .ms-panel-link:hover {
        color: #d97706;
    }

    /* Progress Bars in Left Card */
    .ms-bar-row {
        margin-bottom: 18px;
    }
    .ms-bar-row:last-child {
        margin-bottom: 0;
    }
    .ms-bar-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 7px;
        font-size: 13px;
    }
    .ms-bar-name {
        font-weight: 700;
        color: #0f172a;
        text-decoration: none;
    }
    html.dark .ms-bar-name {
        color: #f1f5f9;
    }
    .ms-bar-name:hover {
        color: #d97706;
    }
    .ms-bar-stat {
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
    }
    html.dark .ms-bar-stat {
        color: #94a3b8;
    }
    .ms-bar-track {
        width: 100%;
        height: 10px;
        border-radius: 9999px;
        background-color: #f1f5f9;
        overflow: hidden;
    }
    html.dark .ms-bar-track {
        background-color: #0f172a;
    }
    .ms-bar-fill {
        height: 100%;
        border-radius: 9999px;
        background: linear-gradient(90deg, #0d3b4c 0%, #f59e0b 100%);
    }

    /* Right Card List Items */
    .ms-list-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 14px;
        border-radius: 12px;
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        margin-bottom: 10px;
        text-decoration: none;
        transition: all 0.15s ease;
    }
    html.dark .ms-list-item {
        background-color: #0f172a;
        border-color: #334155;
    }
    .ms-list-item:hover {
        border-color: #f59e0b;
    }
    .ms-list-left {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
    }
    .ms-list-num {
        width: 28px;
        height: 28px;
        border-radius: 8px;
        background-color: #ffffff;
        border: 1px solid #cbd5e1;
        color: #475569;
        font-size: 12px;
        font-weight: 800;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    html.dark .ms-list-num {
        background-color: #1e293b;
        border-color: #475569;
        color: #cbd5e1;
    }
    .ms-list-title {
        font-size: 13.5px;
        font-weight: 700;
        color: #0f172a;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    html.dark .ms-list-title {
        color: #f8fafc;
    }
    .ms-list-sub {
        font-size: 11.5px;
        color: #64748b;
    }
    html.dark .ms-list-sub {
        color: #94a3b8;
    }
    .ms-list-badge {
        padding: 4px 10px;
        border-radius: 8px;
        font-size: 11.5px;
        font-weight: 800;
        background-color: rgba(245, 158, 11, 0.14);
        color: #b45309;
        white-space: nowrap;
    }
    html.dark .ms-list-badge {
        color: #fbbf24;
    }
</style>
