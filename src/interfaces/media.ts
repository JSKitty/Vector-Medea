import { ResultMessage, ResultMessagev2 } from "./server.js";
import { Request } from "express";

interface legacyMediaReturnMessage extends ResultMessage {
	status: string;
	id: string;
	pubkey: string;
	url: string;
	hash: string;
	magnet: string;
	tags: Array<string>;
}

interface mediaInfoReturnMessage extends ResultMessagev2 {
	satoshi: number;
}

const UploadTypes = ["avatar", "banner", "media"];
const UploadStatus = ["pending", "processing", "completed", "failed"];
const MediaStatus = ["success", "error", "processing"];

interface MediaTypeInfo {
    originalMime: string;
    extension: string;
    convertedMime: string;
	convertedExtension?: string;
}

const mediaTypes: MediaTypeInfo[] = [

    { originalMime: "image/png", extension: "png", convertedMime: "image/webp", convertedExtension: "webp" },
    { originalMime: "image/jpg", extension: "jpg", convertedMime: "image/webp" , convertedExtension: "webp" },
    { originalMime: "image/jpeg", extension: "jpeg", convertedMime: "image/webp" , convertedExtension: "webp" },
    { originalMime: "image/gif", extension: "gif", convertedMime: "image/webp" , convertedExtension: "webp" },
    { originalMime: "image/webp", extension: "webp", convertedMime: "image/webp" , convertedExtension: "webp" },
    { originalMime: "image/svg+xml", extension: "svg", convertedMime: "image/svg+xml" },

    { originalMime: "video/mp4", extension: "mp4", convertedMime: "video/mp4" , convertedExtension: "mp4" },
    { originalMime: "video/quicktime", extension: "mov", convertedMime: "video/mp4" , convertedExtension: "mp4" },
    { originalMime: "video/mpeg", extension: "mpeg", convertedMime: "video/mp4" , convertedExtension: "mp4" },
    { originalMime: "video/webm", extension: "webm", convertedMime: "video/mp4" , convertedExtension: "mp4" },

    { originalMime: "audio/mpeg", extension: "mp3", convertedMime: "audio/mpeg"},
	{ originalMime: "audio/mpg", extension: "mp3", convertedMime: "audio/mpeg" },
	{ originalMime: "audio/mpeg3", extension: "mp3", convertedMime: "audio/mpeg"},
	{ originalMime: "audio/mp3", extension: "mp3", convertedMime: "audio/mpeg" },
	{ originalMime: "audio/wav", extension: "wav", convertedMime: "audio/wav" },
	{ originalMime: "audio/x-wav", extension: "wav", convertedMime: "audio/wav" },
	{ originalMime: "audio/wave", extension: "wav", convertedMime: "audio/wav" },
	{ originalMime: "audio/mp4", extension: "m4a", convertedMime: "audio/mp4" },
	{ originalMime: "audio/x-m4a", extension: "m4a", convertedMime: "audio/mp4" },
	{ originalMime: "audio/m4a", extension: "m4a", convertedMime: "audio/mp4" },
	{ originalMime: "audio/ogg", extension: "ogg", convertedMime: "audio/ogg" },
	{ originalMime: "audio/vorbis", extension: "ogg", convertedMime: "audio/ogg" },
	{ originalMime: "application/ogg", extension: "ogg", convertedMime: "audio/ogg" },
	{ originalMime: "audio/flac", extension: "flac", convertedMime: "audio/flac" },
	{ originalMime: "audio/x-flac", extension: "flac", convertedMime: "audio/flac" },
	{ originalMime: "audio/aac", extension: "aac", convertedMime: "audio/aac" },
	{ originalMime: "audio/aacp", extension: "aac", convertedMime: "audio/aac" },
	{ originalMime: "audio/x-aac", extension: "aac", convertedMime: "audio/aac" },

    { originalMime: "application/pdf", extension: "pdf", convertedMime: "application/pdf" },
	{ originalMime: "application/javascript", extension: "js", convertedMime: "application/javascript" },
    { originalMime: "application/json", extension: "json", convertedMime: "application/json" },
    { originalMime: "application/vnd.ms-fontobject", extension: "eot", convertedMime: "application/vnd.ms-fontobject" },
    { originalMime: "application/yaml", extension: "yaml", convertedMime: "application/yaml" },
	{ originalMime: "application/xml", extension: "xml", convertedMime: "application/xml" },

    { originalMime: "font/otf", extension: "otf", convertedMime: "font/otf" },
    { originalMime: "font/ttf", extension: "ttf", convertedMime: "font/ttf" },
    { originalMime: "font/woff", extension: "woff", convertedMime: "font/woff" },
    { originalMime: "font/woff2", extension: "woff2", convertedMime: "font/woff2" },

	{ originalMime: "text/html", extension: "map", convertedMime: "text/html" },
    { originalMime: "text/markdown", extension: "md", convertedMime: "text/markdown" },
    { originalMime: "text/css", extension: "css", convertedMime: "text/css" },
    { originalMime: "text/x-handlebars-template", extension: "hbs", convertedMime: "text/x-handlebars-template" },
    { originalMime: "text/plain", extension: "txt", convertedMime: "text/plain" },
	{ originalMime: "text/yaml", extension: "yaml", convertedMime: "text/yaml" },

	{ originalMime: "model/stl", extension: "stl", convertedMime: "model/stl" },
];

interface fileData{
	filename: string;
	width: number;
	height: number;
	fileid: string;
	filesize: number;
	pubkey: string;
	originalhash: string;
	hash: string;
	blurhash: string;
	url: string;
	magnet: string;
	torrent_infohash: string;
	date: number;
	servername: string;
	no_transform: boolean;
	media_type: typeof UploadTypes[number];
	originalmime: string;
	outputoptions: string;
	status: string;
	description: string;
	processing_url: string;
	conversionInputPath: string;
	conversionOutputPath: string;
	newFileDimensions: string;
	transaction_id: string;
	payment_request: string;
	visibility: number;

}

interface asyncTask {
	req: Request;
	filedata: fileData;
}

interface videoHeaderRange {
	Start: number;
	End: number;
}

export {
	asyncTask,
	fileData,
	legacyMediaReturnMessage,
	mediaInfoReturnMessage,
	mediaTypes,
	ResultMessage,
	UploadTypes,
	UploadStatus,
	MediaStatus,
	videoHeaderRange
};