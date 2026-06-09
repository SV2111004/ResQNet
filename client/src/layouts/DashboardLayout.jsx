function DashboardLayout({
 children
}) {
 return (
  <div className="flex h-screen">

   <div className="w-64 bg-slate-900">
      Sidebar
   </div>

   <div className="flex-1">

      <div className="h-16 border-b">
         Navbar
      </div>

      <div className="p-6">
         {children}
      </div>

   </div>

  </div>
 );
}

export default DashboardLayout;