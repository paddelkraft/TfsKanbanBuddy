 function jsonDecode(string) {
        try {
            return JSON.parse(string);
        } catch (e) {
            return JSON.decode(string);
        }
    }
    
    function jsonEncode(obj) {
        try {
            return JSON.stringify(obj);
        } catch (e) {
            return JSON.encode(obj);
        }
    }