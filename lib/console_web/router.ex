defmodule ConsoleWeb.Router do
  use ConsoleWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  forward "/graphql/console", Absinthe.Plug.GraphiQL, schema: ConsoleWeb.Schema
  scope "/graphql" do
    pipe_through ConsoleWeb.Plug.GraphqlPipeline

    forward "/", Absinthe.Plug, schema: ConsoleWeb.Schema
  end

  scope "/api", ConsoleWeb do
    pipe_through :api

    post "/users", UserController, :create
    post "/users/resend_verification", UserController, :resend_verification
    post "/users/forgot_password", UserController, :forgot_password
    post "/users/change_password", UserController, :change_password
    post "/sessions", SessionController, :create
    post "/2fa/verify", TwoFactorController, :verify
  end

  scope "/api", ConsoleWeb do
    pipe_through ConsoleWeb.AuthApiPipeline

    resources "/devices", DeviceController, except: [:new, :edit]
    resources "/gateways", GatewayController, except: [:new, :edit]
    resources "/channels", ChannelController, except: [:new, :edit]
    resources "/events", EventController, except: [:new, :edit]
    resources "/teams", TeamController, except: [:new, :edit] do
      post "/switch", TeamController, :switch, as: :switch
    end
    resources "/invitations", InvitationController, only: [:index, :create, :delete]
    resources "/memberships", MembershipController, only: [:index, :update, :delete]
    resources "/notifications", NotificationController, only: [:create] do
      post "/view", NotificationController, :view, as: :view
    end
    post "/notifications/clear", NotificationController, :clear, as: :clear_notifications

    get "/2fa", TwoFactorController, :new
    post "/2fa", TwoFactorController, :create
    post "/2fa/skip", TwoFactorController, :skip
    post "/sessions/refresh", SessionController, :refresh
    get "/users/current", UserController, :current
  end

  scope "/api/router", ConsoleWeb.Router do
    pipe_through :api

    post "/sessions", SessionController, :create
    post "/sessions/refresh", SessionController, :refresh
  end

  scope "/api/router", ConsoleWeb.Router do
    pipe_through ConsoleWeb.RouterApiPipeline

    resources "/devices", DeviceController, only: [:show]
    post "/gateways/register", GatewayController, :register
    post "/gateways/verify", GatewayController, :verify
  end

  if Mix.env == :dev do
    forward "/sent_emails", Bamboo.SentEmailViewerPlug
  end

  scope "/", ConsoleWeb do
    pipe_through :browser # Use the default browser stack

    get "/users/confirm_email/:token", UserController, :confirm_email, as: "confirm_email"
    get "/users/reset_password/:token", UserController, :reset_password, as: "reset_password"

    get "/invitations/accept/:token", InvitationController, :accept, as: "accept_invitation"

    get "/*path", PageController, :index
  end
end
