'use strict';

// const scheduleSchema = require("../model/schedule.model");
const { deletePlaylistHook } = require("./hook");

const deletePlaylistExits = async (idPlaylist, ctx) => {
    const playlist = await strapi.entityService.findOne("plugin::radio.playlist", idPlaylist, {
        populate: {
            playlists_exist: {
                filters: {
                    $not: {
                        publishedAt: null
                    }
                }
            }
        }
    })
    const playlistExits = []

    playlist.playlists_exist.forEach(item => playlistExits.push(item.id)) // get playlist id exits

    if (playlistExits.length >= 1) {
        await strapi.entityService.update("plugin::radio.playlist", idPlaylist, {
            data: {
                note: 'no'
            }
        }) // update note playlits
        for (let i = 0; i < playlistExits.length; i++) {
            await strapi.entityService.update("plugin::radio.playlist", playlistExits[i], {
                data: {
                    publishedAt: null
                }
            })
        } // draft playlist exist and delete playlist in mongose
        const res = await deletePlaylistHook(ctx, playlistExits)
    }

}

module.exports = deletePlaylistExits;