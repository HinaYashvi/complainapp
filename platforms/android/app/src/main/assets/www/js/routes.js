var routes = [
  // Index page
  {
    path: '/index/',
    url: './index.html',
    name: 'index',
  },
  // Components
  
  {
    path: '/dashboard/',
    url: './dashboard.html',
   // name: 'bookride',
  },
  {
    path: '/complaints/',
    url: './complaints.html',
  },  
  {
    path: '/complaintData/',
    url: './complaintData.html',
  },
  {
    path: '/statusComp/',
    url: './statusComp.html',
  },
  {
    path:'/addComplain/',
    url: './addComplain.html',
  },
  {
    path:'/comp_rep/',
    url: './comp_rep.html',
  },
  {
    path:'/comp_mon_rep/',
    url: './comp_mon_rep.html',
  },
  {
    path:'/complain_rep_grid/',
    url: './complain_rep_grid.html',
  },
  {
    path:'/complainmon_rep_grid/',
    url: './complainmon_rep_grid.html',
  },
  {
    path:'/imp-comps/',
    url: './imp-comps.html',
  },
  {
    path:'/change_pwd/',
    url: './change_pwd.html',
  },
  /*{
    path: '/action-sheet/',
    componentUrl: './pages/action-sheet.html',
  },*/
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './404.html',
  },
];
