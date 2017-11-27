import { Helix } from '../../../../src'

export type State<S> = S

export interface Reducers<S> {
  setForm: Helix.Reducer<State<S>, S>
  setField: Helix.Reducer<State<S>, { key: keyof S; value: S[keyof S] }>
}

export interface Effects { }

export type Actions<S> = Helix.Actions<Reducers<S>, Effects>

export function model<S>(state: S): Helix.Model<S, Reducers<S>, Effects> {
  return {
    state,
    reducers: {
      setForm(state, form) {
        return form
      },
      setField(state, { key, value }) {
        return {
          [key]: value,
        } as Partial<S>
      },
    },
  }
}
