class Ability
  include CanCan::Ability

  def initialize(user)

    # See the wiki for details:
    # https://github.com/CanCanCommunity/cancancan/wiki/Defining-Abilities

    # Define abilities for the passed in user here.
    user ||= User.new # guest user (not logged in)

    # admin
    if user.has_role? :admin
      # an admin can do everything
      can :manage, :all
      Rails.logger.info("USER IS ADMIN: #{user.inspect}")
    # authenticated user
    elsif !user.current_sign_in_at.nil?
      can [:read, :dashboard], Input
      can [:show, :update], User, :id => user.id
      can :home, User
      can [:create, :wizard], Project
      can [:edit, :show, :delete, :update], Project, :user_id => user.id
      Rails.logger.info("USER IS AUTHENTICATED: #{user.inspect}")
    # unauthenticated
    else
      can :home, User
      can [:read, :dashboard], Input
      Rails.logger.info("USER IS NOT AUTH: #{user.inspect}")
    end

  end
end
