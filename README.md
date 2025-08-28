# AiToEarn MCP Server

A Model Context Protocol (MCP) server that provides social media publishing and account management capabilities for AI-driven content creation and automation.

## 🚀 Features

- **Account Management**: Retrieve and manage social media accounts
- **Content Publishing**: Publish video and article content to social media platforms
- **Batch Operations**: Publish content to multiple accounts simultaneously
- **Type Validation**: Automatic validation based on content type requirements
- **Error Handling**: Comprehensive error handling with detailed feedback

## 📋 Requirements

- Node.js >= 18.0.0
- npm or yarn
- AiToEarn API access with valid API key

## 🛠️ Installation

### Via npm (Recommended)

```bash
npm install aitoearn-mcp-server
```

### Via GitHub

1. Clone the repository:
```bash
git clone https://github.com/aitoearn/aitoearn-mcp-server.git
cd aitoearn-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## 🔧 Usage

### Using as a Global CLI Tool

After installing globally:
```bash
npm install -g aitoearn-mcp-server
aitoearn-mcp-server
```

### Using as a Local Package

After installing locally:
```bash
npm install aitoearn-mcp-server
npx aitoearn-mcp-server
```

### Programmatic Usage

```javascript
import { spawn } from 'child_process';

// Start the MCP server as a subprocess
const server = spawn('npx', ['aitoearn-mcp-server']);

server.stdout.on('data', (data) => {
  console.log(`Server: ${data}`);
});
```

### Running the MCP Server

```bash
npm start
```

### Available Tools

#### 1. get-account-list
Retrieve a list of social media accounts associated with your API key.

**Parameters:**
- `skKey` (string): Your AiToEarn API key

**Example:**
```json
{
  "skKey": "sk-YOUR_API_KEY_HERE"
}
```

### MCP Client Configuration

#### Claude Desktop

Add the server configuration to your Claude Desktop config file:

**macOS/Linux:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "aitoearn": {
      "command": "npx",
      "args": ["aitoearn-mcp-server"]
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "aitoearn": {
      "command": "aitoearn-mcp-server"
    }
  }
}
```

#### Other MCP Clients

For other MCP clients, refer to their documentation on how to configure MCP servers. The server runs over stdio transport.


#### 2. create-publish
Create and publish content to a specific social media account.

**Parameters:**
- `skKey` (string): Your AiToEarn API key
- `accountId` (string): Target account ID
- `type` (string): Content type ("video" or "article")
- `title` (string): Content title
- `coverUrl` (string): Cover image URL
- `topics` (string): Comma-separated topics/hashtags
- `desc` (string, optional): Content description
- `videoUrl` (string): Video URL (required for video type)
- `imgUrlList` (string): Comma-separated image URLs (required for article type)
- `publishTime` (string, optional): Scheduled publish time

**Example (Video):**
```json
{
  "skKey": "sk-YOUR_API_KEY_HERE",
  "accountId": "account123",
  "type": "video",
  "title": "My Amazing Video",
  "videoUrl": "https://example.com/video.mp4",
  "coverUrl": "https://example.com/cover.jpg",
  "topics": "lifestyle,entertainment"
}
```

**Example (Article):**
```json
{
  "skKey": "sk-YOUR_API_KEY_HERE",
  "accountId": "account123",
  "type": "article",
  "title": "My Article Title",
  "imgUrlList": "https://example.com/img1.jpg,https://example.com/img2.jpg",
  "coverUrl": "https://example.com/cover.jpg",
  "topics": "technology,innovation"
}
```

#### 3. create-publish-list
Batch publish content to all accounts associated with your API key.

**Parameters:**
Same as `create-publish` except `accountId` is not required (publishes to all accounts).

## 🏗️ Content Type Requirements

### Video Content (`type: "video"`)
- **Required**: `videoUrl` - URL to the video file
- **Optional**: `imgUrlList` - Additional images

### Article Content (`type: "article"`)
- **Required**: `imgUrlList` - Comma-separated list of image URLs
- **Optional**: `videoUrl` - Additional video content

## 🔍 Error Handling

The server provides comprehensive error handling with detailed error messages:

- **Validation Errors**: Clear messages about missing required fields
- **API Errors**: Detailed information about API communication issues
- **Network Errors**: Helpful guidance for connectivity problems
- **Authentication Errors**: Clear feedback about API key issues

## 🧪 Development

### Build
```bash
npm run build
```

### Development Mode
```bash
npm run dev
```

## 📝 API Reference

The server integrates with the AiToEarn API:

- **Account List Endpoint**: `GET http://127.0.0.1:7001/plugin/account/list`
- **Publish Endpoint**: `POST http://127.0.0.1:7001/plugin/publish/create`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the AiToEarn team
- Check the documentation in `开发文档.md`

## 🔗 Related Links

- [ModelScope MCP Documentation](https://modelscope.cn/docs/mcp/create)
- [Model Context Protocol Specification](https://spec.modelcontextprotocol.io/)
- [AiToEarn Platform](https://aitoearn.com)