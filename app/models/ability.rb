class Ability
  include CanCan::Ability

  def initialize(user)

    # See the wiki for details:
    # https://github.com/CanCanCommunity/cancancan/wiki/Defining-Abilities

    # Define abilities for the passed in user here.
    user ||= User.new # guest user (not logged in)
                        # a signed-in user can do everything
    # admin
    if user.has_role? :admin
      # an admin can do everything
      can :manage, :all
    
    # authenticated user
    elsif user.encrypted_password
        can :read, Input
        can [:read, :update], User, :id => user.id
    # unauthenticated    
    else
      can :read, Input
    end

  end
end
