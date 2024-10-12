import { DataSource } from '../../toolchain/types/spec/spec_source';

export const specification: DataSource.Specification = {
    category:  "media",
    id_ident:  "mopidy",
    id_author: "thmang82",
    // ---
    provides: [ "music_player" ],
    // ---
    version:   "0.1.3",
    // ---
    translations: {
        'en': { name: "Mopidy Remote Control", description: "Control Mopidy streaming client running e.g. on a Rasperry PI" }
    },
    notifications: [],
    geo_relevance: { everywhere: true },
    // ---
    parameters: [
        {
            type: "TextField",
            ident: "host",
            value_example: "server.lan:8123",
            translations: {
                'en': {
                    name: "Mopidy host address",
                    description: "The host of your mopidy server. Must be in format hostname[:port] (port is optional, defaults to 6680)"
                }
            },
            validate: [ /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/, /^[\d\w_]+(\.lan)?(:\d+)?$/ ],
            value_default: undefined,
            value_type: "string"
        },
        {
            type: "Checkbox",
            ident: "verbose_log",
            translations: {
                'en': {
                    name: "Verbose logging",
                    description: "Only enable when you need to debug something. Leads to lot's of logs!"
                }
            },
            value_default: false,
            value_type: 'boolean'
        },
    ],
    data_fetch: {
        // Note: setting data_fetch to undefined will disable automatic fetching! You have to take care for yourself then, e.g. by subscribing to visiblity changes via ctx.script.visSubscribe
        interval_active_sec: 5 * 60, // Fetch data every  5 minutes in case at least one screen showing data from this source is in state 'active'
        interval_idle_sec: 15 * 60   // Fetch data every 15 minutes in case at least one screen showing data from this source is in state '(active) idle'
    }
}