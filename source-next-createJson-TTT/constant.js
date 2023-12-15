function globalVariable() {
  const inputFolderId = '1PlP9MDNTOgJU_i77IKPJvuAIEe8OFKbo';
  const outputFolderId = '1R-juZjQcKr8lPvIoZ9VlKJ9Ao7kJiw5Z';
  const bucketName = 'bjit-pocekttalk-test-automation-ttt-input';
  const accessKeyId = getAccessKeyId('accessKeyId', 'U2FsdGVkX1+A+HYHmwiL3udpo9R9t4cdZBjoEdrZX4fSgfVeSgAFkI+WFhvao5UN');
  const secretAccessKey = getAccessKeyId('secretAccessKeyId', 'U2FsdGVkX1/d3hhZh5RInVvCtxejJKUQAN20Smj8ZMx6N+m+UAqO7Wc0Icd7jOkEK+kf/iSYUfQVoyx30vl4jw==');
  const region = 'ap-northeast-1';
  const acl = 'private';

  const headerTTT = [
    'sl',
    'source_language',
    'original_text',
    'target_language',
    'translate_text',
    'status',
    'gpt_status',
    'accuracy_score',
    'accuracy_comment',
    'clarity_score',
    'clarity_comments',
    'consistency_score',
    'consistency_comments',
    'cultural_appropriateness_score',
    'cultural_appropriateness_comments',
    'grammar_and_syntax_score',
    'grammar_and_syntax_comment',
    'style_and_tone_score',
    'style_and_tone_comments',
    'flow_and_readability_score',
    'flow_and_readability_comments',
    'naturalness_score',
    'naturalness_comment',
    'completeness_score',
    'completeness_comments',
    'audience_appropriateness_score',
    'audience_appropriateness_comments',
    'improved_translation_result',
  ];

  const scriptProperties = PropertiesService.getScriptProperties();

  // Set each variable in the script properties
  scriptProperties.setProperty('inputFolderId', inputFolderId);
  scriptProperties.setProperty('outputFolderId', outputFolderId);
  scriptProperties.setProperty('bucketName', bucketName);
  scriptProperties.setProperty('accessKeyId', accessKeyId);
  scriptProperties.setProperty('secretAccessKey', secretAccessKey);
  scriptProperties.setProperty('region', region);
  scriptProperties.setProperty('acl', acl);
  scriptProperties.setProperty('headerTTT', JSON.stringify(headerTTT));
}
