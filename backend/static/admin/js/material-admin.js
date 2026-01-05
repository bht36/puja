// Material Admin - User Management Enhancements

document.addEventListener('DOMContentLoaded', function() {
    // Add avatars to user list
    addUserAvatars();
    
    // Add role badges
    addRoleBadges();
    
    // Add status badges
    addStatusBadges();
    
    // Style checkboxes as toggles in form
    styleToggles();
    
    // Enhance table interactions
    enhanceTable();
});

function addUserAvatars() {
    const rows = document.querySelectorAll('#result_list tbody tr');
    rows.forEach(row => {
        const usernameCell = row.querySelector('th.field-username');
        if (usernameCell) {
            const username = usernameCell.textContent.trim();
            const initials = getInitials(username);
            const avatar = document.createElement('span');
            avatar.className = 'user-avatar';
            avatar.textContent = initials;
            avatar.style.background = getColorFromString(username);
            usernameCell.insertBefore(avatar, usernameCell.firstChild);
        }
    });
}

function addRoleBadges() {
    const rows = document.querySelectorAll('#result_list tbody tr');
    rows.forEach(row => {
        const staffCell = row.querySelector('.field-is_staff');
        const superuserCell = row.querySelector('.field-is_superuser');
        
        if (staffCell && superuserCell) {
            const isStaff = staffCell.querySelector('img[alt="True"]');
            const isSuperuser = superuserCell.querySelector('img[alt="True"]');
            
            let badgeClass = 'badge-user';
            let badgeText = 'User';
            
            if (isSuperuser) {
                badgeClass = 'badge-admin';
                badgeText = 'Admin';
            } else if (isStaff) {
                badgeClass = 'badge-staff';
                badgeText = 'Staff';
            }
            
            const badge = document.createElement('span');
            badge.className = `badge ${badgeClass}`;
            badge.textContent = badgeText;
            
            // Replace staff cell content with badge
            staffCell.innerHTML = '';
            staffCell.appendChild(badge);
            
            // Hide superuser column
            if (superuserCell) {
                superuserCell.style.display = 'none';
            }
        }
    });
    
    // Hide superuser header
    const superuserHeader = document.querySelector('th.column-is_superuser');
    if (superuserHeader) {
        superuserHeader.style.display = 'none';
    }
}

function addStatusBadges() {
    const rows = document.querySelectorAll('#result_list tbody tr');
    rows.forEach(row => {
        const activeCell = row.querySelector('.field-is_active');
        if (activeCell) {
            const isActive = activeCell.querySelector('img[alt="True"]');
            
            const badge = document.createElement('span');
            badge.className = isActive ? 'badge badge-active' : 'badge badge-inactive';
            badge.textContent = isActive ? 'Active' : 'Inactive';
            
            activeCell.innerHTML = '';
            activeCell.appendChild(badge);
        }
    });
}

function styleToggles() {
    const checkboxes = document.querySelectorAll('.field-is_active input[type="checkbox"], .field-is_staff input[type="checkbox"], .field-is_superuser input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.classList.add('toggle');
    });
}

function enhanceTable() {
    const table = document.querySelector('#result_list');
    if (table) {
        table.style.width = '100%';
    }
}

function getInitials(name) {
    const parts = name.split(/[\s_]+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

function getColorFromString(str) {
    const colors = [
        '#2196F3', '#4CAF50', '#FF9800', '#9C27B0', 
        '#F44336', '#00BCD4', '#FF5722', '#3F51B5'
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}
