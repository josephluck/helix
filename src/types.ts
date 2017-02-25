export namespace Sakura {
  // Sakura config used during first initialization
  export interface Configuration {
    model: any
    routes: any
  }

  // View (mounted on routes)
  export interface ViewProps {
    state: any
    prev: any
    methods: any
  }
  export type View = preact.ComponentConstructor<ViewProps, null>

  export type Renderer = (props: any, child: View) => any

  // Routing
  export type RouterRenderer = (url: string) => View
  export interface RouterPath {
    pathname: string
  }
  export type LocationModelConstructor = (window) => LocationModel
  export interface LocationModelReducers {
    set: (state: void, location: string) => any
  }
  export interface LocationModel {
    scoped: boolean
    state: any
    reducers: LocationModelReducers
  }
}
