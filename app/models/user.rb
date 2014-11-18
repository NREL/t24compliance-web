class User
  include Mongoid::Document
  # Include default devise modules. Others available are:
  # :lockable, :timeoutable and :omniauthable, :rememberable
  # set :confirmable
  devise :database_authenticatable, :registerable,
         :recoverable, :trackable, :validatable

  # Include role-model gem for roles
  include RoleModel

  ## Database authenticatable
  field :email,              type: String, default: ""
  field :encrypted_password, type: String, default: ""

  ## Recoverable
  field :reset_password_token,   type: String
  field :reset_password_sent_at, type: Time

  ## Rememberable
  #field :remember_created_at, type: Time

  ## Trackable
  field :sign_in_count,      type: Integer, default: 0
  field :current_sign_in_at, type: Time
  field :last_sign_in_at,    type: Time
  field :current_sign_in_ip, type: String
  field :last_sign_in_ip,    type: String

  ## Confirmable
  field :confirmation_token,   type: String
  field :confirmed_at,         type: Time
  field :confirmation_sent_at, type: Time
  field :unconfirmed_email,    type: String # Only if using reconfirmable

  ## Lockable
  # field :failed_attempts, type: Integer, default: 0 # Only if lock strategy is :failed_attempts
  # field :unlock_token,    type: String # Only if unlock strategy is :email or :both
  # field :locked_at,       type: Time

  # optionally set the integer attribute to store the roles in,
  # :roles_mask is the default
  roles_attribute :roles_mask
  field :roles_mask, type: Integer

  # declare the valid roles -- do not change the order if you add more
  # roles later, always append them at the end!
  roles :admin

  # Relations
  has_many :projects


  # ****NOTE:  this is a hack for devise + rails 4.1 to work together
  def self.serialize_into_session(record)
      [record.id.to_s, record.authenticatable_salt]
  end
end
