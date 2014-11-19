module ApplicationHelper
	def active_nav(page)
    path = request.path
    active = ' class="active"'.html_safe
    active2 = 'active'.html_safe

    if path == '/projects'
      active if page == 'Projects'
    elsif path == '/admin'
      active if page == 'Admin'
    elsif path == '/about'
      active if page == 'About'
   end
  end
end
